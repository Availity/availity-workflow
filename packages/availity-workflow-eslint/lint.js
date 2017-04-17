const _ = require('lodash');
const globby = require('globby');
const Promise = require('bluebird');
const eslint = require('eslint');
const ora = require('ora');
const chalk = require('chalk');
const path = require('path');
const Logger = require('availity-workflow-logger');
let settings;

function files(lintObj) {
  const project = _.get(settings, 'project', process.cwd());
  const context = _.get(settings, 'options.context', '');
  const argsInclude = _.get(settings, 'argv.include');

  let output = [];
  if (lintObj.lintInclude) {
    output = _.concat(output, lintInclude);
  } else if (context) {
    output.push(path.join(project, context, '**/*.js'));
    output.push(path.join(project, context, '**/*.jsx'));
  }
  if (argsInclude) {
    output = _.concat(output, argsInclude);
  }
  return output;
};

function lint() {
  settings = require('availity-workflow-settings-2');

  let lintObj = _.get(settings, 'options.lint', {});
  if (_.isString(lintObj) || _.isArray(lintObj)) {
    lintObj = {
      lintInclude: _.castArray(lintObj)
    };
  }
  if (_.isBoolean(lintObj)) {
    lintObj = {
      useLint: lintObj
    };
  }

  if (lintObj.useLint) {
    Logger.warn('Linting is disabled');
    return Promise.resolve(true);
  }
  const engine = new eslint.CLIEngine({
    useEslintrc: true
  });
  Logger.info('Started linting');
  const spinner = ora('running linter rules');
  spinner.color = 'yellow';
  spinner.start();
  return globby(files(lintObj))
  .then(paths => {
    spinner.stop();
    const report = engine.executeOnFiles(paths);
    if (report.errorCount || report.warningCount) {
      const formatter = engine.getFormatter();
      Logger.simple(`${formatter(report.results)}`);

      if (!lintObj.allowWarnings || report.errorCount) {
        if (_.get(settings, 'argv.fail')) {
          process.exit(1);
        }
        return false;
      }
    } else {
      Logger.success(`Finished linting ${chalk.magenta(paths.length)} file(s)`);
      return 'Finished linting';
    }
  });
};

module.exports = {
  desc: `${chalk.dim('Lint source files using ESLint')}`,
  builder: {
    include: {
      alias: 'i',
      describe: 'Glob patterns to INCLUDE for ESLint scanning'
    },
    fail: {
      alias: 'f',
      describe: 'Force linter to fail and exit'
    }
  },
  handler: lint
};
