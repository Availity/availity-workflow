'use strict';

// const nodemon = require('nodemon');
// const path = require('path');
const chalk = require('chalk');
const Promise = require('bluebird');
const webpack = require('webpack');
const WebpackServer = require('webpack-dev-server');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');

const Logger = require('../logger');
const settings = require('../settings');
// const file = require('./file');
const open = require('./open');

// function warning() {

//   const developerConfig = file(path.join(settings.project(), '/project/config/developer-config'));

//   if (!developerConfig) {
//     Logger.warn(`Missing ${chalk.cyan('./project/config/developer-config.js')}. Using defaults.`);
//   }

//   return Promise.resolve(true);

// }

function web() {

  return new Promise((resolve, reject) => {

    const config = require('../webpack');
    config.plugins.push(new ProgressPlugin( (percentage, msg) => {

      const percent = percentage * 100;

      if (percent % 20 === 0 ){
        Logger.info(`${chalk.dim('webpack')} ${msg}`);
      }

    }));

    const compiler = webpack(config);

    compiler.plugin('invalid', () => {
      Logger.info('Started compiling');
    });

    compiler.plugin('done', stats => {

      const hasErrors = stats.hasErrors();
      const hasWarnings = stats.hasWarnings();

      if (!hasErrors && !hasWarnings) {

        const uri = `http://localhost:${settings.servers().app.port}/`;

        Logger.ok('Finished compiling');
        Logger.log(`The app is running at ${chalk.magenta(uri)}`);

        return;

      }

      if (hasErrors) {
        Logger.failed('Failed compiling');
        reject('Failed to compile');
      }

    });

    const server = new WebpackServer(compiler, {
      contentBase: settings.output(),
      noInfo: false, // display no info to console (only warnings and errors)
      quiet: false, // display nothing to the console
      stats: 'minimal',
      compress: true,
      hot: true,
      watchOptions: {
        ignored: /node_modules/
      }
    });

    server.listen(settings.servers().app.port, () => {
      Logger.info(chalk.cyan('Starting the development server...'));
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
  return web()
    .then(open);
}

module.exports = start;
