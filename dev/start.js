'use strict';

// const nodemon = require('nodemon');
const chalk = require('chalk');
const Promise = require('bluebird');
const webpack = require('webpack');
const _ = require('lodash');
const WebpackServer = require('webpack-dev-server');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');

const Logger = require('../logger');
const notifier = require('./notifier');
const settings = require('../settings');
const open = require('./open');

function warning() {

  settings.config();

  return Promise.resolve(true);

}

function web() {

  return new Promise((resolve, reject) => {

    Logger.info('Started compiling');

    const config = require('../webpack');
    config.plugins.push(new ProgressPlugin( (percentage, msg) => {

      const percent = percentage * 100;

      if (percent % 20 === 0 && msg !== null && msg !== undefined && msg !== ''){
        Logger.info(`${chalk.dim('Webpack')} ${msg}`);
      }

    }));

    const compiler = webpack(config);

    compiler.plugin('invalid', () => {
      Logger.info('Started compiling');
    });

    const openBrowser = _.once(() => open());

    _.onceEvery = function(times, func) {
      const orig = times;
      return function() {
        if (--times < 1) {
          times = orig;
          return func.apply(this, arguments);
        }
      };
    };

    // The bless-webpack-plugin listens on the "optimize-assets" and triggers an "emit" event if changes are
    // made to any css chunks.  This makes it appear that Webpack is bundling everything twice in the logs thus
    // this function waits for every 2 emits to print a success message.
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

      Logger.info(statistics);
      Logger.ok('Finished compiling');
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

    const server = new WebpackServer(compiler, {

      contentBase: settings.output(),
      // display no info to console (only warnings and errors)
      noInfo: true,
      // display nothing to the console
      quiet: true,
      compress: true,
      // Enable hot reloading server. Note that only changes
      // to CSS are currently hot reloaded. JS changes will refresh the browser.
      hot: settings.config().development.hot,
      // Reportedly, this avoids CPU overload on some systems.
      // https://github.com/facebookincubator/create-react-app/issues/293
      watchOptions: {
        ignored: /node_modules/
      }

    });

    // middleware


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

// function rest() {

//   const monitor = nodemon({
//     script: path.join(__dirname, '..', 'ekko'),
//     ext: 'json',
//     watch: [
//       path.join(settings.project(), 'project/config/routes.json'),
//       path.join(settings.project(), 'project/data')
//     ],
//     env: {
//       'NODE_ENV': 'development'
//     }
//   }).on('restart', () => {
//     Logger.log(`${chalk.magenta('RESTARTED')} Ekko server due configuration file changes`);
//   });

//   // Capture ^C
//   process.once('SIGINT', () => {
//     monitor.once('exit', () => {
//       Logger.log(`${chalk.magenta('⌘ + C or CTRL + C')} detected exiting`);
//       /* eslint no-process-exit:0 */
//       process.exit();
//     });
//   });

//   return Promise.resolve(true);

// }

// function start() {
//   return warning()
//     // .then(rest)
//     .then(web)
//     .then(open);
// }

function start() {

  return warning()
    .then(web)
    .then(notifier);

}

module.exports = start;
