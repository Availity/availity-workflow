var eslint = require('eslint');
var globby = require('globby');
var BPromise = require('bluebird');

var logger = require('../logger');

module.exports.lint = function lint() {

  var engine = new eslint.CLIEngine({
    useEslintrc: true
  });

  return new BPromise(function(resolve, reject) {

    globby(['**/**.js', '!node_modules/**']).then(function(paths) {

      var report = engine.executeOnFiles(paths.slice(2));
      var formatter = engine.getFormatter();

      if (report.errorCount || report.warningCount) {
        logger.error('eslint');
        logger.log('' + formatter(report.results));
        reject();
      } else {
        logger.log('eslint');
        resolve();
      }

    });

  });

};
