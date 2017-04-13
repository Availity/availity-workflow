
const settings = require('availity-workflow-settings-2');
const yargs = require('yargs');
const chalk = require('chalk');

const scripts = require('./scripts');

yargs
  .usage(`\nUsage: ${chalk.yellow('av')} ${chalk.green('<command>')} ${chalk.magenta('[options]')}`)
  .command(scripts.about)
  .command(scripts.build)
  .command(scripts.lint)
  .command(scripts.release)
  .command(scripts.start)
  .command(scripts.test)
  .demand(1, chalk.red('Must provide a valid cli command'))
  .help('help')
  .alias('h', 'help')
  .showHelpOnFail(false, 'Specify --help for available options')
  .example(chalk.yellow('av start'))
  .example(chalk.yellow('av lint'))
  .argv;
