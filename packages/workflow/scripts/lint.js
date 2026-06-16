import ora from 'ora';
import chalk from 'chalk';
import Logger from '@availity/workflow-logger';
import { createRequire } from 'node:module';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

async function lint({ settings } = {}) {
  if (settings.isLinterDisabled()) {
    Logger.warn('Linting is disabled');
    return true;
  }

  let eslint;
  try {
    const projectRequire = createRequire(path.join(settings.project(), 'package.json'));
    eslint = projectRequire('eslint');
  } catch {
    // no op
  }

  if (!eslint) {
    try {
      eslint = await import('eslint');
      eslint = eslint.default || eslint;
    } catch {
      Logger.failed('Failed linting. Unable to load eslint.');
      throw new Error('Unable to load eslint.');
    }
  }

  let engine;
  try {
    engine = new eslint.ESLint({});
  } catch (error) {
    Logger.failed(`ESLint configuration error in @availity/workflow. "${error.message}"`);
    throw new Error(`ESLint configuration error in @availity/workflow. "${error.message}"`);
  }

  Logger.info('Started linting');
  const spinner = ora('running linter rules');
  spinner.color = 'yellow';
  spinner.start();

  // Determine files to lint
  let filesToLint = settings.js().map((p) => p.replaceAll('\\', '/'));

  if (settings.isIgnoreUntracked()) {
    try {
      const { stdout: rootOut } = await execFileAsync('git', ['rev-parse', '--show-toplevel']);
      const gitRoot = rootOut.trim();
      const { stdout: filesOut } = await execFileAsync('git', ['ls-files']);
      const gitTrackedFiles = filesOut.trim().split('\n').map((file) => path.join(gitRoot, file));
      filesToLint = gitTrackedFiles.filter((file) => ['.js', '.jsx', '.ts', '.tsx'].includes(path.extname(file)));
    } catch {
      // If git commands fail, fall back to default patterns
    }
  }

  const report = await engine.lintFiles(filesToLint);

  const status = { error: false, warning: false };
  for (const result of report) {
    if (result.errorCount) status.error = true;
    if (result.warningCount) status.warning = true;
    if (status.error && status.warning) break;
  }

  spinner.stop();

  if (status.error) {
    const formatter = await engine.loadFormatter();
    Logger.simple(`${formatter.format(report)}`);
    Logger.failed('Failed linting');
    throw new Error('Failed linting');
  }

  if (status.warning) {
    const formatter = await engine.loadFormatter();
    Logger.simple(`${formatter.format(report)}`);
    Logger.warn('Passed linting with warnings');
  } else {
    Logger.success(`Finished linting ${chalk.magenta(report.length)} file(s)`);
  }

  return true;
}

export default lint;
