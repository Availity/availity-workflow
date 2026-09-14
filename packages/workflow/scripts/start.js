import Logger from '@availity/workflow-logger';
import chalk from 'chalk';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import deepMerge from '../helpers/deep-merge.js';
import webpackConfigBase from '../webpack.config.js';
import webpackConfigProduction from '../webpack.config.profile.js';

import proxy from './proxy.js';
import open from './open.js';
import formatWebpackMessages from './format.js';

process.on('unhandledRejection', (reason) => {
  if (reason && reason.stack) {
    Logger.error(reason.stack);
    Logger.empty();
  }
});

function once(fn) {
  let called = false;
  let result;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

function showStartupMessage(settings) {
  const wantedPort = settings.config().development.port;
  const actualPort = settings.port();
  const differentPort = wantedPort !== actualPort;
  const uri = `http://${settings.host()}:${actualPort}/`;
  Logger.box(
    `The app ${chalk.yellow(settings.pkg().name)} is running at ${chalk.green(uri)}${
      differentPort
        ? `
${chalk.yellow.bold('Warning:')} Port ${chalk.blue(wantedPort)} was already in use so we used ${chalk.blue(
            actualPort
          )}.`
        : ''
    }`
  );
}

async function rest(settings) {
  if (!settings.isEkko()) return null;

  const ekkoOptions = {
    data: settings.config().ekko.data,
    routes: settings.config().ekko.routes,
    plugins: settings.config().ekko.plugins,
    port: settings.ekkoPort(),
    host: settings.host(),
    pluginContext: settings.config().ekko.pluginContext,
    logProvider() {
      return {
        log(...args) {
          Logger.log(...args);
        },
        debug(...args) {
          Logger.debug(...args);
        },
        info(...args) {
          Logger.info(...args);
        },
        warn(...args) {
          Logger.warn(...args);
        },
        error(...args) {
          Logger.error(...args);
        },
      };
    },
  };

  try {
    const { default: Ekko } = await import('@availity/mock-server');
    const ekko = new Ekko();
    await ekko.start(ekkoOptions);
    return ekko;
  } catch (error) {
    Logger.error(
      "Failed to create Ekko Server. Please install '@availity/mock-server' with `yarn install @availity/mock-server --dev` or check your settings"
    );
    Logger.error(error.message || error);
    return null;
  }
}

function web(settings, ekko) {
  return new Promise((resolve, reject) => {
    let previousPercent;
    let webpackConfig;
    // Declared here so the done hook closure can reference it before the
    // WebpackDevServer instantiation below (avoids no-use-before-define).
    let server;

    if (settings.isDryRun() && settings.isDevelopment()) {
      Logger.message('Using production webpack settings', 'Dry Run');
      webpackConfig = webpackConfigProduction(settings);
    } else {
      webpackConfig = webpackConfigBase(settings);
    }

    const { modifyWebpackConfig } = settings.config();

    if (typeof modifyWebpackConfig === 'function') {
      webpackConfig = modifyWebpackConfig(webpackConfig, settings) || webpackConfig;
    }

    webpackConfig.plugins.push(
      new webpack.ProgressPlugin((percentage, msg) => {
        const percent = Math.round(percentage * 100);

        if (previousPercent !== percent && percent % 10 === 0) {
          Logger.info(`${chalk.dim('Webpack')} ${percent}% ${msg}`);
          previousPercent = percent;
        }
      })
    );

    const compiler = webpack(webpackConfig);

    compiler.hooks.invalid.tap('invalid', () => {
      previousPercent = null;
      Logger.info('Started compiling');
    });

    const startupMessage = once(() => showStartupMessage(settings));
    const openBrowser = once(() => open(settings));

    compiler.hooks.done.tap('done', async (stats) => {
      const json = stats.toJson({}, true);
      const messages = formatWebpackMessages(json);

      if (stats.hasErrors()) {
        for (const error of messages.errors) {
          Logger.empty();
          Logger.simple(`${chalk.red(error)}`);
          Logger.empty();
        }

        Logger.failed('Failed compiling');
        Logger.empty();
        // Stop both servers so the process can exit cleanly. Without this, their open
        // socket handles keep Node alive even after process.exit(1) is called.
        try {
          await server.stop();
        } catch {
          /* best-effort */
        }
        try {
          if (ekko?.stop) await ekko.stop();
        } catch {
          /* best-effort */
        }
        reject(new Error(json.errors[0]));
        return;
      }

      startupMessage();
      openBrowser();
    });

    const defaults = {
      client: {
        logging: settings.infrastructureLogLevel(),
        overlay: {
          warnings: false,
          errors: true,
          runtimeErrors: true,
        },
      },

      port: settings.port(),

      historyApiFallback: settings.historyFallback(),

      compress: true,

      hot: settings.enableHotLoader(),

      static: {
        directory: settings.output(),

        // Reportedly, this avoids CPU overload on some systems.
        // https://github.com/facebookincubator/create-react-app/issues/293
        watch: {
          ignored: /node_modules(\\+|\/)+(?!(@availity|@av))/,
        },
      },
    };

    const devServerOptions = deepMerge(defaults, settings.config().development.webpackDevServer);
    const proxyConfig = proxy(settings);

    if (proxyConfig) {
      devServerOptions.proxy = proxyConfig;
    }

    server = new WebpackDevServer(devServerOptions, compiler);

    const runServer = async () => {
      try {
        Logger.info('Starting development server');
        await server.start();
        Logger.info('Started development server');
        resolve();
      } catch (error) {
        Logger.failed('Failed to start development server');
        Logger.failed(error);
        try {
          await server.stop();
        } catch {
          /* best-effort */
        }
        try {
          if (ekko?.stop) await ekko.stop();
        } catch {
          /* best-effort */
        }
        reject(error);
      }
    };

    runServer();
  });
}

async function start({ settings }) {
  settings.log();

  // Start Ekko first so the proxy target is ready when webpack dev server opens.
  // Store the instance so we can stop it if webpack compilation fails later.
  const ekko = await rest(settings);

  await web(settings, ekko);
}

export default start;
