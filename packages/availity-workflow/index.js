#! /usr/bin/env node
const yargs = require('yargs');
const chalk = require('chalk');
const start = require('./scripts/start');
const test = require('./scripts/test');

yargs

  .usage(`\nUsage: ${chalk.yellow('$0')} ${chalk.green('<command>')} ${chalk.magenta('[options]')}`)

  .command('start', `${chalk.dim('Start the development server')}`, () => { start() })
  .command('lint', `${chalk.dim('Lint source files using ESLint')}`, () => { console.log('lint') })
  .command('release', `${chalk.dim('Bundle project for distribution')}`, () => { console.log('release') })
  .command('test', `${chalk.dim(test.description)}`, () => { test.run() })
  .command('about', `${chalk.dim('About availity-workflow')}`, () => { console.log('about') })

  .demand(1, chalk.red('Must provide a valid command'))

  .help('help')
  .alias('h', 'help')
  .showHelpOnFail(false, 'Specify --help for available options')

  .example(chalk.yellow('$0 start'))
  .example(chalk.yellow('$0 lint'))

  .argv;
