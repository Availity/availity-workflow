import ora from 'ora';
import chalk from 'chalk';
import Logger from '@availity/workflow-logger';
import { createRequire } from 'node:module';
import { performance } from 'node:perf_hooks';
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

  const eslintConfig = settings.config().eslint ?? {};
  const { fix = false, quiet = false, failOnWarning = false, failOnError = true, maxWarnings } = eslintConfig;

  let engine;
  try {
    engine = new eslint.ESLint({ errorOnUnmatchedPattern: false, fix });
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
      const gitTrackedFiles = filesOut
        .trim()
        .split('\n')
        .map((file) => path.join(gitRoot, file));
      filesToLint = gitTrackedFiles.filter((file) => ['.js', '.jsx', '.ts', '.tsx'].includes(path.extname(file)));
    } catch {
      // If git commands fail, fall back to default patterns
    }
  }

  const startTime = performance.now();
  const report = await engine.lintFiles(filesToLint);

  // Write fixes back to disk when fix mode is enabled
  if (fix) {
    await eslint.ESLint.outputFixes(report);
  }

  if (settings.isVerbose()) {
    spinner.stop();
    Logger.info(`Linting ${chalk.magenta(report.length)} file(s):`);
    for (const result of report) {
      Logger.simple(`  ${chalk.dim(result.filePath)}`);
    }
    spinner.start();
  }

  // In quiet mode, strip warnings from the report so only errors are shown/counted
  const effectiveReport = quiet ? eslint.ESLint.getErrorResults(report) : report;

  const status = { error: false, warning: false };
  let totalWarnings = 0;
  for (const result of effectiveReport) {
    if (result.errorCount) status.error = true;
    if (result.warningCount) {
      status.warning = true;
      totalWarnings += result.warningCount;
    }
    if (status.error && status.warning) break;
  }

  // maxWarnings takes precedence over failOnWarning when both are set
  const warningThresholdExceeded =
    maxWarnings !== undefined ? totalWarnings > maxWarnings : failOnWarning && status.warning;

  spinner.stop();

  if (status.error && failOnError) {
    const formatter = await engine.loadFormatter();
    Logger.simple(`${formatter.format(effectiveReport)}`);
    Logger.failed('Failed linting');
    throw new Error('Failed linting');
  }

  if (warningThresholdExceeded) {
    const formatter = await engine.loadFormatter();
    Logger.simple(`${formatter.format(effectiveReport)}`);
    const msg =
      maxWarnings !== undefined
        ? `Failed linting: ${totalWarnings} warning(s) exceeded maxWarnings limit of ${maxWarnings}`
        : 'Failed linting: warnings found and failOnWarning is enabled';
    Logger.failed(msg);
    throw new Error(msg);
  }

  if (status.error || status.warning) {
    const formatter = await engine.loadFormatter();
    Logger.simple(`${formatter.format(effectiveReport)}`);
    if (status.error) {
      Logger.warn('Passed linting with errors (failOnError is disabled)');
    } else {
      Logger.warn('Passed linting with warnings');
    }
  } else {
    const elapsed = performance.now() - startTime;
    const duration = elapsed < 1000 ? `${elapsed.toFixed(0)}ms` : `${(elapsed / 1000).toFixed(1)}s`;
    Logger.success(`Finished linting ${chalk.magenta(report.length)} file(s) in ${chalk.cyan(duration)}`);
  }

  return true;
}

export default lint;
