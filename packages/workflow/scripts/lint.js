const globby = require('globby');
const ora = require('ora');
const chalk = require('chalk');
const Logger = require('@availity/workflow-logger');
const requireRelative = require('require-relative');
const path = require('path');
const { spawnSync } = require('child_process');
const settings = require('../settings');

function lint() {
  let engine;

  if (settings.isLinterDisabled()) {
    Logger.warn('Linting is disabled');
    return Promise.resolve(true);
  }

  let eslint;
  try {
    eslint = requireRelative('eslint', settings.project());
  } catch (error) {
    // no op
  }

  if (!eslint) {
    // eslint-disable-next-line global-require
    eslint = require('eslint');
  }

  let future;

  try {
    engine = new eslint.CLIEngine({
      useEslintrc: true
    });
  } catch (error) {
    future = Promise.reject(new Error('ESLint configuration error in @availity/workflow'));
  }

  if (future) {
    return future;
  }

  future = new Promise((resolve, reject) => {
    Logger.info('Started linting');
    const spinner = ora('running linter rules');
    spinner.color = 'yellow';
    spinner.start();

    // files tracked by git
    let gitTrackedFiles;
    if (settings.isIgnoreUntracked()) {
      const gitRootCmd = spawnSync('git', ['rev-parse', '--show-toplevel']);
      if (gitRootCmd.status) {
        // non-zero exit code; assume git repository absent
        gitTrackedFiles = null;
      } else {
        const gitLsFiles = spawnSync('git', ['ls-files']);
        gitTrackedFiles = gitLsFiles.stdout
          .toString()
          .trim()
          .split('\n');
        const gitRoot = gitRootCmd.stdout.toString().trim();
        gitTrackedFiles = gitTrackedFiles.map(f => path.join(gitRoot, f));
      }
    }

    // Uses globby which defaults to process.cwd() and path.resolve(options.cwd, "/")
    /* eslint-disable promise/catch-or-return */
    globby(settings.js().map(path => path.replace(/\\/g, '/'))).then(paths => {
      spinner.stop();
      const filesToLint = gitTrackedFiles
        ? // git repository present
          paths.filter(f => gitTrackedFiles.indexOf(f) > 0)
        : paths;

      const report = engine.executeOnFiles(filesToLint);

      /* eslint-disable promise/always-return */
      if (report.errorCount || report.warningCount) {
        const formatter = engine.getFormatter();
        Logger.simple(`${formatter(report.results)}`);
        Logger.failed('Failed linting');
        reject(report.results);
        if (settings.isFail()) {
          // eslint-disable-next-line unicorn/no-process-exit
          process.exit(1);
        }
      } else {
        Logger.success(`Finished linting ${chalk.magenta(paths.length)} file(s)`);
        resolve('Finished linting');
      }
    });
  });

  return future;
}

module.exports = lint;
