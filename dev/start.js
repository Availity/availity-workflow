'use strict';

const nodemon = require('nodemon');
const chalk = require('chalk');
const Promise = require('bluebird');
const perfy = require('perfy');
const webpack = require('webpack');
const _ = require('lodash');
const path = require('path');
const WebpackServer = require('webpack-dev-server');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const os = require('os');

const Logger = require('../logger');
const notifier = require('./notifier');
const settings = require('../settings');
const open = require('./open');
const proxy = require('./proxy');

// Globals that ref the servers so they
//  can be shutdown properly when SIGINT is
//  detected
let server;
let ekko;
let monitor;

function isMac() {
  return os.platform() === 'darwin';
}

function init() {

  settings.init();
  settings.log();

  return Promise.resolve(true);

}

function web() {

  return new Promise((resolve, reject) => {

    const config = require('../webpack');
    config.plugins.push(new ProgressPlugin( (percentage, msg) => {

      const percent = percentage * 100;

      if (percent % 20 === 0 && msg !== null && msg !== undefined && msg !== ''){
        Logger.info(`${chalk.dim('Webpack')} ${msg}`);
      }

    }));

    const compiler = webpack(config);

    compiler.plugin('compile', () => {
      perfy.start('webpack-perf');
    });

    compiler.plugin('invalid', () => {
      Logger.info('Started compiling');
    });

    const openBrowser = _.once(() => open());

    // The bless-webpack-plugin listens on the "optimize-assets" and triggers an "emit" event if changes are
    // made to any css chunks.  This makes it appear that Webpack is bundling everything twice in the logs thus
    // this function is debounced to prevent the appearnace of duplicates.
    //
    // Removing the bless-webpack-plugin resolves the issue but then we run the risk of creating css bundles
    // great than the IE9 limit.
    //
    // https://blogs.msdn.microsoft.com/ieinternals/2011/05/14/stylesheet-limits-in-internet-explorer
    //
    const message = _.debounce(stats => {

      openBrowser();

      const statistics = stats.toString({
        colors: true,
        cached: true,
        reasons: false,
        source: false,
        chunks: false,
        children: false
      });

      const uri = `http://localhost:${settings.config().development.port}/`;

      const result = perfy.end('webpack-perf');

      Logger.info(statistics);
      const time = `${result.time}s`;

      Logger.info(`Finished compiling in ${chalk.magenta(time)}`);
      Logger.box(`The app is running at ${chalk.green(uri)}`);

    }, 300);

    compiler.plugin('done', stats => {

      const hasErrors = stats.hasErrors();
      const hasWarnings = stats.hasWarnings();

      if (!hasErrors && !hasWarnings) {
        message(stats);
      }

      if (hasErrors) {
        Logger.failed('Failed compiling');
        Logger.info(stats.compilation.errors);
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
      // Enable hot reloading server. Note that only changes
      // to CSS are currently hot reloaded. JS changes will refresh the browser.
      hot: settings.config().development.hot,

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

    server = new WebpackServer(compiler, webpackOptions);

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

function ekkoSimple() {

  const Ekko = require('availity-ekko');
  ekko = new Ekko();

  return ekko.start({
    data: settings.config().ekko.data,
    routes: settings.config().ekko.routes,
    plugins: settings.config().ekko.plugins,
    pluginContext: settings.config().ekko.pluginContext
  });

}

function ekkoMonitored() {

  if (settings.isEkko()) {

    monitor = nodemon({
      script: path.join(__dirname, '.', 'ekko'),
      exitcrash: true,
      ext: 'json',
      watch: [
        settings.config().ekko.routes,
        settings.config().ekko.data
      ],
      env: {
        'NODE_ENV': 'development'
      }
    }).on('restart', () => {
      Logger.log(`Ekko server ${chalk.magenta('RESTARTED')} due configuration file changes`);
    });

  } else {
    Logger.info(`Ekko server is ${chalk.magenta('DISABLED')}`);
  }

  return Promise.resolve(true);

}

function rest() {

  if (settings.config().development.monitored) {
    return ekkoMonitored();
  }

  return ekkoSimple();
}

function exit() {

  // Capture ^C
  process.once('SIGINT', () => {

    const command = isMac() ? '⌘ + C' : 'CTRL + C';
    Logger.empty();
    Logger.info(`Detected ${chalk.blue(command)} now exiting.`);

    try {
      server.close();
    } catch (err) {
      // no op
    }

    try {
      ekko.stop();
    } catch (err) {
      // no op
    }

    if (monitor) {

      monitor.once('exit', () => {
        /* eslint no-process-exit:0 */
        process.exit(0);
      });

    }

  });

}

function start() {

  return init()
    .then(rest)
    .then(web)
    .then(notifier)
    .then(exit);

}

module.exports = start;
