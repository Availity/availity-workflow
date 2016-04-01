var Promise = require('bluebird');
var webpack = require('webpack');
var _ = require('lodash');
var ora = require('ora');

var check = require('./check');
var logger = require('../logger');

function bundle() {

  var statistics = [];

  return new Promise(function(resolve, reject) {

    var webpackConfig = require('../webpack').get();
    logger.info('Started bundling');
    var spinner = ora('Running webpack');
    spinner.color = 'yellow';
    spinner.start();

    var compiler = webpack(webpackConfig);
    var bundleCounts = Object.keys(webpackConfig.entry).length;

    var done = _.after(bundleCounts, function() {

      spinner.stop();
      logger.info(statistics[0]);
      logger.ok('Finished bundling');
      resolve();

    });

    compiler.run(function(err, stats) {

      if (err) {
        spinner.stop();
        logger.error('Failed bundle', err);
        reject();
      }

      var _stats = stats.toString({
        colors: true,
        cached: true,
        reasons: false,
        source: false,
        chunks: false
      });

      statistics.push(_stats);

      done();

    });

  });

}

function build() {
  return check()
    .then(bundle);
}

module.exports = build;
