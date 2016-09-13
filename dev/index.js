#! /usr/bin/env node
'use strict';

const yargs = require('yargs');
const chalk = require('chalk');

const lint = require('./lint');
const start = require('./start');
const test = require('./test');

yargs
  .usage(`Usage: ${chalk.yellow('$0')} ${chalk.green('<command>')} ${chalk.magenta('[options]')}`)

  .command('start', `${chalk.dim('Start the development server')}`, () => { start() })
  .command('lint', `${chalk.dim('Lint source files using ESLint')}`, () => { lint() })
  .command('test', `${chalk.dim('Run test files using Karma and PhantomJS')}`, () => { test.continous() })

  .demand(1, chalk.red('Must provide a valid command'))

  .help('help')
  .alias('h', 'help')
  .showHelpOnFail(false, 'Specify --help for available options')

  .example(chalk.yellow('$0 start'))
  .example(chalk.yellow('$0 lint'))

  .argv;
