const os = require('os');
const Logger = require('availity-workflow-logger');
const chalk = require('chalk');
const webpack = require('webpack');
const once = require('lodash.once');
const pretty = require('pretty-ms');
const debounce = require('lodash.debounce');
const Ekko = require('availity-ekko');
const Promise = require('bluebird');
const settings = require('availity-workflow-settings');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const WebpackDevSever = require('webpack-dev-server');

const proxy = require('./proxy');
const notifier = require('./notifier');
const plugin = require('./plugin');
const open = require('./open');

let server;
let ekko;

Promise.config({
  longStackTraces: true
});

const friendlySyntaxErrorLabel = 'Syntax error:';

function isLikelyASyntaxError(message) {
  return message.indexOf(friendlySyntaxErrorLabel) !== -1;
}

function formatMessage(message) {
  return message
    .replace(
      'Module build failed: SyntaxError:',
      friendlySyntaxErrorLabel
    )
    .replace(
      /Module not found: Error: Cannot resolve 'file' or 'directory'/,
      'Module not found:'
    )
    // Internal stacks are generally useless so we strip them
    .replace(/^\s*at\s((?!webpack:).)*:\d+:\d+[\s\)]*(\n|$)/gm, '') // at ... ...:x:y
    // Webpack loader names obscure CSS filenames
    .replace('./~/css-loader!./~/postcss-loader!', '')
    .replace(/\s@ multi .+/, '');
}

const startupMessage = once(() => {
  const uri = `http://localhost:${settings.config().development.port}/`;
  Logger.box(`The app is running at ${chalk.green(uri)}`);
});

// development.logLevel=custom
function customStats(stats) {
  return stats.toString({
    colors: true,
    cached: true,
    reasons: false,
    source: false,
    chunks: false,
    children: false,
    errorDetails: true
  });
}

function compileMessage(stats) {

  // Get the time
  const statistics = stats.toJson();
  const level = settings.logLevel();

  const statz = level === 'custom' ? customStats(stats) : stats.toString(level);
  Logger.info(`${chalk.dim('Webpack stats:')}

${statz}
`);
  Logger.success(`${chalk.gray('Compiled')} in ${chalk.magenta(pretty(statistics.time))}
  `);

  startupMessage();
}

function init() {
  settings.log();
  return Promise.resolve(true);
}

function rest() {

  if (settings.isEkko()) {

    const ekkoOptions = {
      data: settings.config().ekko.data,
      routes: settings.config().ekko.routes,
      plugins: settings.config().ekko.plugins,
      pluginContext: settings.config().ekko.pluginContext,
      logProvider() {
        return {
          log() {
            Logger.log(...arguments);
          },
          debug() {
            Logger.debug(...arguments);
          },
          info() {
            Logger.info(...arguments);
          },
          warn() {
            Logger.warn(...arguments);
          },
          error() {
            Logger.error(...arguments);
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

    const webpackConfig = plugin('webpack.config');

    webpackConfig.plugins.push(new ProgressPlugin( (percentage, msg) => {

      const percent = percentage * 100;

      if (percent % 20 === 0 && msg !== null && msg !== undefined && msg.trim() !== '') {
        Logger.info(`${chalk.dim('Webpack')} ${Math.round(percent)}% ${msg}`);
      }

    }));

    const compiler = webpack(webpackConfig);

    compiler.plugin('invalid', () => {
      Logger.info('Started compiling');
    });

    const openBrowser = once(open);
    const message = debounce(compileMessage, 500);

    compiler.plugin('done', stats => {

      const hasErrors = stats.hasErrors();
      const hasWarnings = stats.hasWarnings();

      if (!hasErrors && !hasWarnings) {
        openBrowser();
        message(stats);
      }

      if (hasErrors) {

        // https://webpack.js.org/configuration/stats/
        const json = stats.toJson({
          assets: false,
          colors: true,
          version: false,
          hash: false,
          timings: false,
          chunks: false,
          chunkModules: false,
          errorDetails: true
        });

        let formattedErrors = json.errors.map(msg => {
          return 'Error in ' + formatMessage(msg);
        });

        if (formattedErrors.some(isLikelyASyntaxError)) {
          formattedErrors = formattedErrors.filter(isLikelyASyntaxError);
        }

        formattedErrors.forEach(error => {
          Logger.empty();
          Logger.simple(`${chalk.red(error)}`);
          Logger.empty();
        });

        Logger.failed('Failed compiling');
        reject('Failed compiling');
      }

    });

    const webpackOptions = {

      contentBase: settings.output(),
      // display no info to console (only warnings and errors)
      noInfo: true,
      // display nothing to the console
      quiet: true,

      historyApiFallback: settings.historyFallback(),

      compress: true,

      hot: true,

      // Reportedly, this avoids CPU overload on some systems.
      // https://github.com/facebookincubator/create-react-app/issues/293
      watchOptions: {
        ignored: /node_modules/
      }

    };

    const proxyConfig = proxy();

    if (proxyConfig) {
      webpackOptions.proxy = proxyConfig;
    }

    server = new WebpackDevSever(compiler, webpackOptions);

    server.listen(settings.config().development.port, (err) => {

      if (err) {
        Logger.failed(err);
        reject(err);
      }

      Logger.info('Started development server');
      resolve();

    });

  });

}

function isMac() {
  return os.platform() === 'darwin';
}

function closeServer() {
  return new Promise((resolve, reject) => {
    try {
      server.close(() => resolve());
    } catch (err) {
      reject(err);
    }
  });
}

function exit() {

  // Capture ^C
  process.on('SIGINT', () => {

    const command = isMac() ? '⌘ + C' : 'CTRL + C';
    Logger.empty();
    Logger.info(`Detected ${chalk.blue(command)} now exiting.`);

    closeServer()
      .then(() => {
        if (ekko) {
          return ekko.stop();
        }
      })
      .catch(err => {
        Logger.error(err);
      })
      .finally(() => {
        /* eslint no-process-exit: 0 */
        process.exit(0);
      });

  });

}

function start() {

  process.on('unhandledRejection', (reason) => {

    if (reason && reason.stack) {
      Logger.error(reason.stack);
      Logger.empty();
    }

  });

  return init()
    .then(web)
    .then(notifier)
    .then(rest)
    .then(exit);
}

module.exports = start;
