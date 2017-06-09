// const os = require('os');
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
const formatWebpackMessages = require('./format');

let server;
let ekko;

Promise.config({
  longStackTraces: true
});

const startupMessage = once(() => {
  const uri = `http://${settings.config().development.host}:${settings.config().development.port}/`;
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
      port: settings.config().ekko.port,
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

    let previousPercent;

    // Allow production version to run in development
    const webpackConfig = settings.isDryRun() && settings.isDevelopment() ? plugin('webpack.config.production') : plugin('webpack.config');

    webpackConfig.plugins.push(new ProgressPlugin( (percentage, msg) => {

      const percent = Math.round(percentage * 100);

      if (previousPercent !== percent && percent % 10 === 0) {
        Logger.info(`${chalk.dim('Webpack')} ${percent}% ${msg}`);
        previousPercent = percent;
      }

    }));

    const compiler = webpack(webpackConfig);

    compiler.plugin('invalid', () => {
      previousPercent = null;
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
        resolve(true);
      }

      // https://webpack.js.org/configuration/stats/
      const json = stats.toJson({}, true);
      const messages = formatWebpackMessages(json);

      if (hasWarnings) {

        messages.warnings.forEach(warning => {
          Logger.empty();
          Logger.simple(`${chalk.yellow(warning)}`);
          Logger.empty();
        });

        Logger.failed('Compiled with warnings');
        Logger.empty();

      }

      if (hasErrors) {

        messages.errors.forEach(error => {
          Logger.empty();
          Logger.simple(`${chalk.red(error)}`);
          Logger.empty();
        });

        Logger.failed('Failed compiling');
        Logger.empty();
        reject(json.errors);
        return;
      }

      resolve();

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
    .then(rest);
}

module.exports = start;
