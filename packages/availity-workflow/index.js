#! /usr/bin/env node

const Promise = require('bluebird');
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

Promise.config({
  longStackTraces: true
});

settings.init();

yargs

  .usage(`\nUsage: ${chalk.yellow('av')} ${chalk.green('<command>')} ${chalk.magenta('[options]')}`)

  .command('start', `${chalk.dim('Start the development server')}`, () => { start() })

  .command('lint', `${chalk.dim('Lint source files using ESLint')}`, yyargs => {
    return yyargs
      .option('include', {
        alias: 'i',
        describe: 'Glob patterns to INCLUDE for ESLint scanning'
      })
      .option('fail', {
        alias: 'f',
        describe: 'Force linter to fail and exit'
      });
  }, () => { lint().catch(() => { /* noop */}) })

  .command('test', `${chalk.dim(test.description)}`, yyargs => {
    return yyargs
      .option('watch', {
        alias: 'w',
        describe: 'Watch files for changes and rerun tests related to changed files.'
      });
  }, () => { test.run().catch(() => { /* noop */}) })

  .command('profile', `${chalk.dim('Analyze Webpack bundles and find what is contributing their sizes')}`, () => { profile() })

  .command('build', `${chalk.dim('Bundle project for distribution (production or stagingå)')}`, () => { build() })

  .command('release', `${chalk.dim('Bundle project for distribution (production or stagingå) and create a git tag')}`, () => { release() })

  .command('about', `${chalk.dim('About availity-workflow')}`, () => { about() })

  .demand(1, chalk.red('Must provide a valid cli command'))

  .help('help')
  .alias('h', 'help')
  .showHelpOnFail(false, 'Specify --help for available options')

  .example(chalk.yellow('av start'))
  .example(chalk.yellow('av lint'))

  .argv;
