var eslint = require('eslint');
var globby = require('globby');
var Promise = require('bluebird');
var ora = require('ora');

var logger = require('../logger');
var context = require('../context');

function lint() {

  var engine = new eslint.CLIEngine({
    useEslintrc: true
  });

  return new Promise(function(resolve, reject) {

    logger.info('Started linting');
    var spinner = ora('running linter rules');
    spinner.color = 'yellow';
    spinner.start();

    globby(context.settings.js.src).then(function(paths) {

      var report = engine.executeOnFiles(paths.slice(2));

      if (report.errorCount || report.warningCount) {

        spinner.stop();
        var formatter = engine.getFormatter();
        logger.info('' + formatter(report.results));
        logger.error('Failed linting');
        reject();

      } else {

        spinner.stop();
        logger.ok('Completed linting ');
        resolve();

      }

    });

  });

}

module.exports = lint;
