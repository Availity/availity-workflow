const Logger = require('@availity/workflow-logger');
const chalk = require('chalk');
const webpack = require('webpack');
const { once, debounce, merge } = require('lodash');
const pretty = require('pretty-ms');
const Ekko = require('@availity/mock-server');
const settings = require('@availity/workflow-settings');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const WebpackDevSever = require('webpack-dev-server');

const proxy = require('./proxy');
const notifier = require('./notifier');
const plugin = require('./plugin');
const customStats = require('./stats');
const open = require('./open');
const formatWebpackMessages = require('./format');

let server;
let ekko;

const startupMessage = once(() => {
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
});

function compileMessage(stats, message) {
  // Get the time
  const statistics = stats.toJson();
  const level = settings.logLevel();

  const statz = level === 'custom' ? customStats(stats) : stats.toString(level);
  Logger.info(`${chalk.dim('Webpack stats:')}

${statz}
`);
  Logger.success(`${chalk.gray('Compiled')} in ${chalk.magenta(pretty(statistics.time))}
  `);

  if (message) {
    message();
  }

  startupMessage();
}

function init() {
  settings.log();
}

function rest() {
  if (settings.isEkko()) {
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
            Logger.log(args);
          },
          debug(...args) {
            Logger.debug(args);
          },
          info(...args) {
            Logger.info(args);
          },
          warn(...args) {
            Logger.warn(args);
          },
          error(...args) {
            Logger.error(args);
          }
        };
      }
    };

    ekko = new Ekko();

    return ekko.start(ekkoOptions);
  }

  return Promise.resolve();
}

function web() {
  return new Promise((resolve, reject) => {
    let previousPercent;

    let webpackConfig;
    // Allow production version to run in development
    if (settings.isDryRun() && settings.isDevelopment()) {
      Logger.message('Using production webpack settings', 'Dry Run');
      webpackConfig = plugin({
        path: 'webpack.config.production',
        settings
      });
    } else {
      webpackConfig = plugin({
        path: 'webpack.config',
        settings
      });
    }

    webpackConfig.plugins.push(
      new ProgressPlugin((percentage, msg) => {
        const percent = Math.round(percentage * 100);

        if (previousPercent !== percent && percent % 10 === 0) {
          Logger.info(`${chalk.dim('Webpack')} ${percent}% ${msg}`);
          previousPercent = percent;
        }
      })
    );

    const { modifyWebpackConfig } = settings.config();

    if (typeof modifyWebpackConfig === 'function') {
      webpackConfig = modifyWebpackConfig(webpackConfig, settings) || webpackConfig;
    }

    const compiler = webpack(webpackConfig);

    compiler.hooks.invalid.tap('invalid', () => {
      previousPercent = null;
      Logger.info('Started compiling');
    });

    const openBrowser = once(open);
    const message = debounce(compileMessage, 500);

    compiler.hooks.done.tap('done', stats => {
      const hasErrors = stats.hasErrors();
      const hasWarnings = stats.hasWarnings();

      // https://webpack.js.org/configuration/stats/
      const json = stats.toJson({}, true);
      const messages = formatWebpackMessages(json);

      if (!hasErrors && !hasWarnings) {
        openBrowser();
        message(stats);
        return resolve();
      }

      function warning() {
        Logger.empty();
        Logger.alert('Compiled with warnings');
        Logger.empty();
      }

      if (hasWarnings && !hasErrors) {
        message(stats, warning);
        openBrowser();
        return resolve();
      }

      if (hasErrors) {
        messages.errors.forEach(error => {
          Logger.empty();
          Logger.simple(`${chalk.red(error)}`);
          Logger.empty();
        });

        Logger.failed('Failed compiling');
        Logger.empty();
        return reject(json.errors);
      }

      return resolve();
    });

    let webpackOptions = {
      contentBase: settings.output(),

      // display nothing to the console
      quiet: true,

      // Don't enable this else webpack middleware will log messages and
      // users will see log message printed twice
      // noInfo: true,

      clientLogLevel: 'none',

      historyApiFallback: settings.historyFallback(),

      compress: true,

      hot: true,

      // Reportedly, this avoids CPU overload on some systems.
      // https://github.com/facebookincubator/create-react-app/issues/293
      watchOptions: {
        ignored: /node_modules([\\]+|\/)+(?!(@availity|@av))/
      }
    };

    webpackOptions = merge(webpackOptions, settings.config().development.webpackDevServer);
    const proxyConfig = proxy();

    if (proxyConfig) {
      webpackOptions.proxy = proxyConfig;
    }

    server = new WebpackDevSever(compiler, webpackOptions);

    server.listen(settings.port(), settings.host(), err => {
      if (err) {
        Logger.failed(err);
        reject(err);
      }

      Logger.info('Started development server');
      resolve();
    });
  });
}

async function start() {
  process.on('unhandledRejection', reason => {
    if (reason && reason.stack) {
      Logger.error(reason.stack);
      Logger.empty();
    }
  });

  init();
  await web();
  await notifier();
  await rest();
}

module.exports = start;
