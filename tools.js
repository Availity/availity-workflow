var eslint = require('eslint');
var globby = require('globby');
var Promise = require('bluebird');

var logger = require('./logger');

function lint() {

  var engine = new eslint.CLIEngine({
    useEslintrc: true
  });

  return new Promise(function(resolve, reject) {

    logger.info('Started linting');

    globby(['**/*.js', '!node_modules/**']).then(function(paths) {

      var report = engine.executeOnFiles(paths.slice(2));

      if (report.errorCount || report.warningCount) {

        var formatter = engine.getFormatter();
        logger.info('' + formatter(report.results));
        logger.error('Failed linting');
        reject();

      } else {

        logger.ok('Finished linting');
        resolve();

      }

    });

  });

}

lint();
