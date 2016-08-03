'use strict';

const eslint = require('eslint');
const globby = require('globby');
const Promise = require('bluebird');

const logger = require('./logger');

function lint() {

  const engine = new eslint.CLIEngine({
    useEslintrc: true
  });

  return new Promise( (resolve, reject) => {

    logger.info('Started linting');

    globby(['**/*.js', '!node_modules/**']).then( paths => {

      const report = engine.executeOnFiles(paths.slice(2));

      if (report.errorCount || report.warningCount) {

        const formatter = engine.getFormatter();
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
