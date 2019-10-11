#!/usr/bin/env node


const yargs = require('yargs');
const chalk = require('chalk');
const start = require('./scripts/start');
const test = require('./scripts/test');
const lint = require('./scripts/lint');
const about = require('./scripts/about');
const build = require('./scripts/build');
const release = require('./scripts/release');
const profile = require('./scripts/profile');
const settings = require('./settings');
require('./scripts/init');

yargs.command(
  'release',
  `${chalk.dim('Bundle project for distribution (production or staging) and create a git tag')}`,
  yyargs => {
    yyargs
      .version(false)
      .option('version', {
        alias: 'v',
        describe: 'Specify which version you want to use when tagging the project and creating the release.'
      })
      .usage(`\nUsage: ${chalk.yellow('av release')} ${chalk.magenta('[options]')}`)
      .example(chalk.yellow(`${chalk.yellow('av release')} ${chalk.magenta('-v 2.0.0')}`));
  },
  () => {
    settings.init();
    release({ settings });
  }
);

/* eslint-disable no-unused-expressions */
yargs

  .usage(`\nUsage: ${chalk.yellow('av')} ${chalk.green('<command>')} ${chalk.magenta('[options]')}`)

  .command('start', `${chalk.dim('Start the development server')}`, () => {
    settings
      .init()
      .then(() => start())
      .catch(() => {
        /* noop */
      });
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
        })
        .option('disable-linter', {
          describe: 'Disable linter when creating bundles for production or staging'
        });
    },
    () => {
      settings.init();
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
      settings.init();
      test.run({ settings }).catch(() => {
        /* noop */
      });
    }
  )

  .command('profile', `${chalk.dim('Analyze Webpack bundles and find what is contributing their sizes')}`, () => {
    settings.init();
    profile(settings);
  })

  .command('build', `${chalk.dim('Bundle project for distribution (production or staging)')}`, () => {
    settings.init();
    build({ settings });
  })

  .command('about', `${chalk.dim('About @availity/workflow')}`, () => {
    settings.init();
    about({ settings });
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
