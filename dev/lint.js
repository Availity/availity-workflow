'use strict';

const eslint = require('eslint');
const globby = require('globby');
const Promise = require('bluebird');
const ora = require('ora');

const Logger = require('../logger');
const settings = require('../settings')

function lint() {

  const engine = new eslint.CLIEngine({
    useEslintrc: true
  });

  return new Promise((resolve, reject) => {

    Logger.info('Started linting');
    const spinner = ora('running linter rules');
    spinner.color = 'yellow';
    spinner.start();

    globby(settings.js.src).then(paths => {

      const report = engine.executeOnFiles(paths.slice(2));

      if (report.errorCount || report.warningCount) {

        spinner.stop();
        const formatter = engine.getFormatter();
        Logger.info(`${formatter(report.results)}`);
        Logger.error('Failed linting');
        reject();

      } else {

        spinner.stop();
        Logger.ok('Finished linting ');
        resolve();

      }

    });

  });

}

module.exports = lint;
