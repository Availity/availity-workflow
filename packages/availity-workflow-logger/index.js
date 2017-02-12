/* eslint no-console:0 */
const chalk = require('chalk');
const figures = require('figures');
const boxen = require('boxen');

class Logger {

  constructor(options) {
    this.options = options;
  }

  static warn(entry) {
    this.record(entry, 'yellow');
  }

  static error(entry) {
    this.record(entry, 'red');
  }

  static info(entry) {
    this.record(entry);
  }

  static log(entry) {
    this.record(entry);
  }

  static record(entry, elColor) {

    const defaultColor = entry instanceof Error ? 'red' : 'gray';

    const color = elColor || defaultColor;
    let label = chalk.gray.bold(figures.pointerSmall);
    label = `${label}`;
    console.log(`${label} ${ chalk[color](entry) }` );

  }

  static simple(entry) {
    console.log(entry);
  }

  static empty() {
    console.log('');
  }

  static failed(entry) {
    const label = chalk.white.bold(' FAILED ');
    this.record(`${chalk.bgRed(label)} ${entry}`, 'red');
  }

  static err(entry) {
    const label = chalk.white.bold(' ERROR ');
    console.log(`${chalk.bgRed(label)} ${chalk.red(entry)}`);
  }

  static ok(entry) {
    const label = chalk.white.bold(' SUCCESS ');
    this.record(`${chalk.bgGreen(label)} ${entry}`, 'green');
  }

  static box(entry) {
    console.log(boxen(`${chalk.gray(entry)}`, {padding: 1, borderColor: 'yellow', borderStyle: 'classic', dimBorder: true}));
  }

}

module.exports = Logger;
