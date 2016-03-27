var eslint = require('eslint');
var globby = require('globby');
var Promise = require('bluebird');

var logger = require('../logger');
var context = require('../context');

function lint() {

  var engine = new eslint.CLIEngine({
    useEslintrc: true
  });

  return new Promise(function(resolve, reject) {

    globby(context.settings.js.src).then(function(paths) {

      var report = engine.executeOnFiles(paths.slice(2));
      var formatter = engine.getFormatter();

      if (report.errorCount || report.warningCount) {
        logger.error('eslint failed');
        logger.info('' + formatter(report.results));
        reject();
      } else {
        logger.info('eslint ok');
        resolve();
      }

    });

  });

}

module.exports = lint;
