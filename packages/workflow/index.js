#!/usr/bin/env node
import yargsFactory from 'yargs';
import chalk from 'chalk';
import Logger from '@availity/workflow-logger';
import start from './scripts/start.js';
import test from './scripts/test.js';
import lint from './scripts/lint.js';
import about from './scripts/about.js';
import build from './scripts/build.js';
import release from './scripts/release.js';
import profile from './scripts/profile.js';
import settings from './settings/index.js';
import './scripts/init.js';

// ESM imports are hoisted, so this runs after all modules are loaded
if (process.env.NODE_ENV === 'staging') {
  process.argv.push('--no-optimize');
  process.env.NODE_ENV = 'production';
}
const shouldMimicStaging = process.argv.includes('--no-optimize');

function handleError(command, error) {
  Logger.error(`Command "${command}" failed:`);
  Logger.error(error?.stack || error?.message || error);
  process.exitCode = 1;
}

const yargs = yargsFactory(process.argv.slice(2));

yargs.command(
  'release',
  `${chalk.dim('Bundle project for distribution (production or staging) and create a git tag')}`,
  (yyargs) => {
    yyargs
      .version(false)
      .option('version', {
        alias: 'v',
        describe: 'Specify which version you want to use when tagging the project and creating the release.'
      })
      .usage(`\nUsage: ${chalk.yellow('av release')} ${chalk.magenta('[options]')}`)
      .example(chalk.yellow(`${chalk.yellow('av release')} ${chalk.magenta('-v 2.0.0')}`));
  },
  async () => {
    try {
      await settings.init({ shouldMimicStaging });
      await release({ settings });
    } catch (error) {
      handleError('release', error);
    }
  }
);

// eslint-disable-next-line no-unused-expressions
yargs

  .usage(`\nUsage: ${chalk.yellow('av')} ${chalk.green('<command>')} ${chalk.magenta('[options]')}`)

  .option('bundler', {
    describe: 'Which bundler to use',
    choices: ['webpack', 'vite'],
    global: true
  })

  .option('test-runner', {
    describe: 'Which test runner to use',
    choices: ['jest', 'vitest'],
    global: true
  })

  .command('start', `${chalk.dim('Start the development server')}`, async () => {
    try {
      await settings.init();
      await start();
    } catch (error) {
      handleError('start', error);
    }
  })

  .command(
    'lint',
    `${chalk.dim('Lint source files using ESLint')}`,
    (yyargs) => {
      yyargs
        .option('include', {
          alias: 'i',
          describe: 'Glob patterns to INCLUDE for ESLint scanning'
        })
        .option('fail', {
          alias: 'f',
          describe: 'Force linter to fail and exit'
        })
        .option('ignore-git-untracked', {
          alias: 'u',
          describe: 'Ignore files that are not indexed by git'
        })
        .option('disable-linter', {
          describe: 'Disable linter when creating bundles for production or staging'
        });
    },
    async () => {
      try {
        await settings.init();
        await lint();
      } catch (error) {
        handleError('lint', error);
      }
    }
  )

  .command(
    'test',
    `${chalk.dim(test.description)}`,
    (yyargs) =>
      yyargs.option('watch', {
        alias: 'w',
        describe: 'Watch files for changes and rerun tests related to changed files.'
      }),
    async () => {
      try {
        await settings.init();
        await test.run({ settings });
      } catch (error) {
        handleError('test', error);
      }
    }
  )

  .command('profile', `${chalk.dim('Analyze Webpack bundles and find what is contributing their sizes')}`, async () => {
    try {
      await settings.init();
      await profile(settings);
    } catch (error) {
      handleError('profile', error);
    }
  })

  .command('build', `${chalk.dim('Bundle project for distribution (production or staging)')}`, async () => {
    try {
      await settings.init({ shouldMimicStaging });
      await build({ settings });
    } catch (error) {
      handleError('build', error);
    }
  })

  .command('about', `${chalk.dim('About @availity/workflow')}`, async () => {
    try {
      await settings.init();
      about({ settings });
    } catch (error) {
      handleError('about', error);
    }
  })

  .demand(1, chalk.red('Must provide a valid cli command'))

  .showHelpOnFail(false, 'Specify --help for available options')

  .help('help')
  .alias('help', 'h')

  .version()
  .alias('version', 'v')

  .example(chalk.yellow('av start'))

  .example(chalk.yellow('av lint'))

  .epilog(`View documentation at ${chalk.blue('https://github.com/availity/availity-workflow')}`).argv;
