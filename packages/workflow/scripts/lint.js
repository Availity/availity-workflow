import { readdir } from 'fs/promises';
import ora from 'ora';
import chalk from 'chalk';
import Logger from '@availity/workflow-logger';
import { createRequire } from 'module';
import path from 'path';
import { spawnSync } from 'child_process';
import settings from '../settings/index.js';

// Expand glob patterns like "dir/**/*.ext" using native fs
async function expandGlobs(patterns) {
  const results = new Set();
  for (const pattern of patterns) {
    const doubleStarIdx = pattern.indexOf('**');
    if (doubleStarIdx === -1) {
      results.add(pattern);
      continue;
    }
    const baseDir = pattern.slice(0, doubleStarIdx).replace(/\/$/, '') || '.';
    const ext = path.extname(pattern);
    try {
      const entries = await readdir(baseDir, { recursive: true });
      for (const entry of entries) {
        if (path.extname(entry) === ext) {
          results.add(path.join(baseDir, entry));
        }
      }
    } catch {
      // directory not found, skip
    }
  }
  return [...results];
}

async function lint() {
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

  // Files tracked by git
  let gitTrackedFiles;
  if (settings.isIgnoreUntracked()) {
    const gitRootCmd = spawnSync('git', ['rev-parse', '--show-toplevel']);
    if (gitRootCmd.status) {
      // Non-zero exit code; assume git repository absent
      gitTrackedFiles = null;
    } else {
      const gitLsFiles = spawnSync('git', ['ls-files']);
      gitTrackedFiles = gitLsFiles.stdout.toString().trim().split('\n');

      const gitRoot = gitRootCmd.stdout.toString().trim();
      gitTrackedFiles = gitTrackedFiles.map((file) => path.join(gitRoot, file));
    }
  }

  // Uses expandGlobs which defaults to process.cwd() and path.resolve(options.cwd, "/")
  const paths = await expandGlobs(settings.js().map((p) => p.replaceAll('\\', '/')));

  // Git repository present
  const filesToLint = gitTrackedFiles ? paths.filter((file) => gitTrackedFiles.indexOf(file) > 0) : paths;

  const report = await engine.lintFiles(filesToLint);

  const status = { error: false, warning: false };
  for (const result of report) {
    if (result.errorCount) status.error = true;
    if (result.warningCount) status.warning = true;

    // If we have error and warning already then no need to check more
    if (status.error && status.warning) {
      break;
    }
  }

  spinner.stop();

  if (status.error || status.warning) {
    const formatter = await engine.loadFormatter();

    Logger.simple(`${formatter.format(report)}`);
    Logger.failed('Failed linting');

    // eslint-disable-next-line unicorn/no-process-exit
    if (settings.isFail()) process.exit(1);

    if (status.error) throw new Error('Failed linting');
  } else {
    Logger.success(`Finished linting ${chalk.magenta(paths.length)} file(s)`);
  }

  return true;
}

export default lint;
