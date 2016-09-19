#! /usr/bin/env node
'use strict';

const yargs = require('yargs');
const chalk = require('chalk');

const lint = require('./lint');
const start = require('./start');
const release = require('./release');
const Logger = require('../logger');
const test = require('./test');
const availityLogo = require('./availity');


yargs
  .usage(`Usage: ${chalk.yellow('$0')} ${chalk.green('<command>')} ${chalk.magenta('[options]')}`)

  .command('start', `${chalk.dim('Start the development server')}`, () => { start() })
  .command('lint', `${chalk.dim('Lint source files using ESLint')}`, () => { lint() })
  .command('test', `${chalk.dim('Run test files using Karma and PhantomJS')}`, () => { test.continous() })
  .command('release', `${chalk.dim('Bundle project for release candidate')}`, () => { release() })
  .command('about', `${chalk.dim('Information workflow')}`, () => {
    Logger.simple(availityLogo);
  })

  .demand(1, chalk.red('Must provide a valid command'))

  .help('help')
  .alias('h', 'help')
  .showHelpOnFail(false, 'Specify --help for available options')

  .example(chalk.yellow('$0 start'))
  .example(chalk.yellow('$0 lint'))

  .argv;
