#! /usr/bin/env node
const yargs = require('yargs');
const chalk = require('chalk');
const start = require('./scripts/start');
const test = require('./scripts/test');
const lint = require('./scripts/lint');
const about = require('./scripts/about');
const release = require('./scripts/release');
const Promise = require('bluebird');

Promise.config({
  longStackTraces: true
});

yargs

  .usage(`\nUsage: ${chalk.yellow('av')} ${chalk.green('<command>')} ${chalk.magenta('[options]')}`)

  .command('start', `${chalk.dim('Start the development server')}`, () => { start() })

  .command('lint', `${chalk.dim('Lint source files using ESLint')}`, yyargs => {
    return yyargs
      .option('include', {
        alias: 'i',
        describe: 'Glob patterns to INCLUDE for ESLint scanning'
      });
  }, () => {
    lint()
      .catch(() => {
        // noop
      });
  })

  .command('release', `${chalk.dim('Bundle project for distribution')}`, () => { release() })

  .command('test', `${chalk.dim(test.description)}`, () => { test.run() })

  .command('about', `${chalk.dim('About availity-workflow')}`, () => { about() })

  .demand(1, chalk.red('Must provide a valid cli command'))

  .help('help')
  .alias('h', 'help')
  .showHelpOnFail(false, 'Specify --help for available options')

  .example(chalk.yellow('av start'))
  .example(chalk.yellow('av lint'))

  .argv;
