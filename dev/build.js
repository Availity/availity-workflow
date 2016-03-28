var Promise = require('bluebird');
var webpack = require('webpack');
var _ = require('lodash');
var ora = require('ora');

var webpackConfig = require('../webpack');
var logger = require('../logger');

function build() {

  var statistics = [];

  return new Promise(function(resolve, reject) {

    var spinner = ora('Starting webpack build...');
    spinner.color = 'yellow';
    spinner.start();

    var compiler = webpack(webpackConfig);
    var bundleCounts = Object.keys(webpackConfig.entry).length;

    var done = _.after(bundleCounts, function() {

      spinner.stop();
      logger.info(statistics[0]);
      logger.ok('Completed webpack build');
      resolve();

    });

    compiler.run(function(err, stats) {

      if (err) {
        spinner.stop();
        logger.error('Failed webpack build', err);
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

module.exports = build;
