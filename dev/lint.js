'use strict';

const eslint = require('eslint');
const globby = require('globby');
const Promise = require('bluebird');
const ora = require('ora');

const Logger = require('../logger');
const settings = require('../settings');

function lint() {

  const engine = new eslint.CLIEngine({
    useEslintrc: true
  });

  return new Promise((resolve, reject) => {

    Logger.info('Started linting');
    const spinner = ora('running linter rules');
    spinner.color = 'yellow';
    spinner.start();

    const files = settings.js();

    globby(files).then(paths => {

      spinner.stop();

      const report = engine.executeOnFiles(paths);

      if (report.errorCount || report.warningCount) {

        const formatter = engine.getFormatter();
        Logger.info(`${formatter(report.results)}`);
        Logger.failed('Failed linting');
        reject();

      } else {

        Logger.ok(`Finished linting ${paths.length} file(s)`);
        resolve();

      }

    });

  });

}

module.exports = lint;
