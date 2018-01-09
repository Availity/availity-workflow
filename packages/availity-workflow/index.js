#!/usr/bin/env node

const settings = require('availity-workflow-settings');

const yargs = require('yargs');
const chalk = require('chalk');
const start = require('./scripts/start');
const test = require('./scripts/test');
const lint = require('./scripts/lint');
const about = require('./scripts/about');
const build = require('./scripts/build');
const release = require('./scripts/release');
const profile = require('./scripts/profile');

settings.init();

/* eslint-disable no-unused-expressions */
yargs

  .usage(`\nUsage: ${chalk.yellow('av')} ${chalk.green('<command>')} ${chalk.magenta('[options]')}`)

  .command('start', `${chalk.dim('Start the development server')}`, () => {
    start();
  })

  .command(
    'lint',
    `${chalk.dim('Lint source files using ESLint')}`,
    yyargs => {
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
        });
    },
    () => {
      lint().catch(() => {
        /* noop */
      });
    }
  )

  .command(
    'test',
    `${chalk.dim(test.description)}`,
    yyargs =>
      yyargs.option('watch', {
        alias: 'w',
        describe: 'Watch files for changes and rerun tests related to changed files.'
      }),
    () => {
      test.run().catch(() => {
        /* noop */
      });
    }
  )

  .command('profile', `${chalk.dim('Analyze Webpack bundles and find what is contributing their sizes')}`, () => {
    profile();
  })

  .command('build', `${chalk.dim('Bundle project for distribution (production or staging)')}`, () => {
    build();
  })

  .command(
    'release',
    `${chalk.dim('Bundle project for distribution (production or staging) and create a git tag')}`,
    () => {
      release();
    }
  )

  .command('about', `${chalk.dim('About availity-workflow')}`, () => {
    about();
  })

  .demand(1, chalk.red('Must provide a valid cli command'))

  .showHelpOnFail(false, 'Specify --help for available options')

  .help('help')
  .alias('help', 'h')

  .version(require('./package.json').version)

  .example(chalk.yellow('av start'))

  .example(chalk.yellow('av lint'))

  .epilog(`View documentation at ${chalk.blue('https://github.com/availity/availity-workflow')}`).argv;
