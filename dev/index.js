#! /usr/bin/env node
'use strict';

const yargs = require('yargs');
const chalk = require('chalk');

const lint = require('./lint');

yargs
  .usage(`Usage: ${chalk.yellow('$0')} ${chalk.green('<command>')} ${chalk.magenta('[options]')}`)

  .command('start', `${chalk.dim('Start the development server')}`)
  .command('lint', `${chalk.dim('Lint you source files using ESLint')}`, (yargs) => {
    debugger;
    lint()
  })

  .demand(1, chalk.red('Must provide a valid command'))

  .help('help')
  .alias('h', 'help')
  .showHelpOnFail(true, 'Specify --help for available options')

  .example(chalk.yellow('$0 start'))
  .example(chalk.yellow('$0 lint'))

  .argv;

// const argv = yargs.argv;
// if (!argv._[0]) {
//   yargs.showHelp();
//   return 0;
// }

// const commands = {
//   lint: require('./lint'),
//   release: require('./release'),
//   build: require('./build'),
//   version: require('./version'),
//   start: require('./start'),
//   test: require('./test').continous
// };

// commands[argv._[0]]();
