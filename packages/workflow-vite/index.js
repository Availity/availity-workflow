#!/usr/bin/env node
import yargsFactory from 'yargs';
import chalk from 'chalk';
import Logger from '@availity/workflow-logger';
import Settings from './settings/index.js';

function handleError(command, error) {
  Logger.error(`Command "${command}" failed:`);
  Logger.error(error?.stack || error?.message || error);
  process.exit(1);
}

function getStagingOptions() {
  if (process.env.NODE_ENV === 'staging') {
    process.env.NODE_ENV = 'production';
    return { shouldMimicStaging: true };
  }
  return {};
}

const yargs = yargsFactory(process.argv.slice(2));

yargs
  .usage(`\nUsage: ${chalk.yellow('av')} ${chalk.green('<command>')} ${chalk.magenta('[options]')}`)

  .command(
    'start',
    `${chalk.dim('Start the Vite development server')}`,
    (yyargs) => {
      yyargs.option('dry-run', { describe: 'Serve production build from dist/ (run av build first)' });
    },
    async (argv) => {
      try {
        const settings = await Settings.create({ argv });
        const { default: start } = await import('./scripts/start.js');
        await start({ settings });
      } catch (error) {
        handleError('start', error);
      }
    }
  )

  .command(
    'lint',
    `${chalk.dim('Lint source files using ESLint')}`,
    (yyargs) => {
      yyargs
        .option('include', { alias: 'i', describe: 'Glob patterns to INCLUDE for ESLint scanning' })
        .option('ignore-git-untracked', { alias: 'u', describe: 'Ignore files not indexed by git' })
        .option('disable-linter', { describe: 'Disable linter' });
    },
    async (argv) => {
      try {
        const settings = await Settings.create({ argv });
        const { default: lint } = await import('./scripts/lint.js');
        await lint({ settings });
      } catch (error) {
        handleError('lint', error);
      }
    }
  )

  .command(
    'test',
    `${chalk.dim('Run tests using Vitest')}`,
    (yyargs) => {
      yyargs
        .option('coverage', { describe: 'Run tests with coverage reporting', type: 'boolean' })
        .option('watch', { describe: 'Run tests in watch mode', type: 'boolean' })
        .option('reporter', { describe: 'Test reporter (e.g., verbose, json, junit)', type: 'string' })
        .option('changed', { describe: 'Run tests for changed files (optionally specify base ref)', type: 'string' })
        .option('bail', { describe: 'Stop after first failure (optionally specify count)', type: 'number' })
        .option('silent', { describe: 'Suppress console output from tests', type: 'boolean' })
        .option('ui', { describe: 'Open Vitest UI', type: 'boolean' });
    },
    async (argv) => {
      try {
        const settings = await Settings.create({ argv });
        const { default: test } = await import('./scripts/test.js');
        await test({ settings });
      } catch (error) {
        handleError('test', error);
      }
    }
  )

  .command(
    'build',
    `${chalk.dim('Bundle project for distribution with Vite')}`,
    () => {},
    async (argv) => {
      try {
        const settings = await Settings.create({ ...getStagingOptions(), argv });
        const { default: build } = await import('./scripts/build.js');
        await build({ settings });
      } catch (error) {
        handleError('build', error);
      }
    }
  )

  .command(
    'release',
    `${chalk.dim('Bundle for distribution and create a git tag')}`,
    (yyargs) => {
      yyargs
        .version(false)
        .option('version', { alias: 'v', describe: 'Specify release version' })
        .usage(`\nUsage: ${chalk.yellow('av release')} ${chalk.magenta('[options]')}`)
        .example(chalk.yellow(`${chalk.yellow('av release')} ${chalk.magenta('-v 2.0.0')}`));
    },
    async (argv) => {
      try {
        const settings = await Settings.create({ ...getStagingOptions(), argv });
        const { default: release } = await import('./scripts/release.js');
        await release({ settings, version: argv.version });
      } catch (error) {
        handleError('release', error);
      }
    }
  )

  .command(
    'profile',
    `${chalk.dim('Analyze bundles and find what contributes to their size')}`,
    () => {},
    async (argv) => {
      try {
        const settings = await Settings.create({ argv });
        const { default: profile } = await import('./scripts/profile.js');
        await profile({ settings });
      } catch (error) {
        handleError('profile', error);
      }
    }
  )

  .command(
    'about',
    `${chalk.dim('About @availity/workflow-vite')}`,
    () => {},
    async () => {
      try {
        const { default: about } = await import('./scripts/about.js');
        about();
      } catch (error) {
        handleError('about', error);
      }
    }
  )

  .command(
    'init <projectName> [options]',
    `${chalk.dim('Initialize a new Vite project from a starter template.')}`,
    (yyargs) => {
      yyargs
        .positional('projectName', { describe: 'The name of the project you want to create.' })
        .version(false)
        .option('currentDir', { alias: 'c', describe: 'Initialize in the current folder', default: false })
        .option('template', {
          alias: 't',
          describe: 'The starter template (Git Repo)',
          default: 'https://github.com/Availity/availity-starter-react',
        })
        .option('branchOverride', { alias: 'b', describe: 'Branch of the template to use' })
        .option('useNpm', { alias: 'n', describe: 'Use npm instead of yarn', default: false })
        .usage(`\nUsage: ${chalk.yellow('av init')} ${chalk.green('<projectName>')} ${chalk.magenta('[options]')}`)
        .example(chalk.yellow('av init my-app-name'));
    },
    async (argv) => {
      try {
        const { createApp } = await import('./scripts/init.js');
        await createApp(argv);
      } catch (error) {
        handleError('init', error);
      }
    }
  )

  .command(
    'update-browsers',
    `${chalk.dim('Update the caniuse-lite browser database')}`,
    () => {},
    async () => {
      try {
        const { default: updateBrowsers } = await import('./scripts/update-browsers.js');
        updateBrowsers();
      } catch (error) {
        handleError('update-browsers', error);
      }
    }
  )

  .demandCommand(1, chalk.red('Must provide a valid cli command'))
  .showHelpOnFail(false, 'Specify --help for available options')
  .help('help')
  .alias('help', 'h')
  .version()
  .alias('version', 'V')
  .example(chalk.yellow('av start'))
  .example(chalk.yellow('av build'))
  .example(chalk.yellow('av test'))
  .example(chalk.yellow('av lint'))
  .example(chalk.yellow('av init my-app-name'))
  .epilog(`View documentation at ${chalk.blue('https://github.com/availity/availity-workflow')}`)
  .parse();
