#! /usr/bin/env node

const Promise = require('bluebird');
const settings = require('availity-workflow-settings');

const yargs = require('yargs');
const chalk = require('chalk');
const start = require('./scripts/start');
const test = require('./scripts/test');
const lint = require('./scripts/lint');
const about = require('./scripts/about');
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
      });
  }, () => {lint().catch(() => { /* noop */}) })

  .command('profile', `${chalk.dim('Analyze Webpack bundles and find what is contributing their size')}`, () => { profile() })

  .command('release', `${chalk.dim('Bundle project for distribution (production, staging or integration)')}`, () => { release() })

  .command('test', `${chalk.dim(test.description)}`, () => { test.run().catch(() => { /* noop */}) })

  .command('about', `${chalk.dim('About availity-workflow')}`, () => { about() })

  .demand(1, chalk.red('Must provide a valid cli command'))

  .help('help')
  .alias('h', 'help')
  .showHelpOnFail(false, 'Specify --help for available options')

  .example(chalk.yellow('av start'))
  .example(chalk.yellow('av lint'))

  .argv;
