'use strict';

const Promise = require('bluebird');
const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const ora = require('ora');

const Logger = require('../logger');

function bundle() {

  return new Promise( (resolve, reject) => {

    const webpackConfig = require('../webpack');
    Logger.info('Started compiling');
    const spinner = ora('Running webpack');
    spinner.color = 'yellow';
    spinner.start();

    webpackConfig.plugins.push(new ProgressPlugin( (percentage, msg) => {

      const percent = percentage * 100;

      if (percent % 20 === 0 && msg !== null && msg !== undefined && msg !== ''){
        spinner.text = `Webpack ${msg}`;
      }

    }));

    webpack(webpackConfig).run((err, stats) => {

      spinner.stop();

      if (err) {
        Logger.failed('Failed compiling');
        reject(err);
        return;
      }

      const statistics = stats.toString({
        colors: true,
        cached: true,
        reasons: false,
        source: false,
        chunks: false,
        children: false
      });

      Logger.info(statistics);
      Logger.ok('Finished compiling');
      resolve();

    });

  });

}

module.exports = bundle;
