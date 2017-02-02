/* eslint no-console:0 */
const chalk = require('chalk');
const dateformat = require('dateformat');
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

  static record(entry, _color) {

    const now = dateformat(new Date(), 'HH:MM:ss');
    const defaultColor = entry instanceof Error ? 'red' : 'gray';

    const color = _color || defaultColor;
    console.log(`[${ chalk.cyan(now) }] ${ chalk[color](entry) }` );

  }

  static simple(entry) {
    console.log(entry);
  }

  static empty() {
    console.log('');
  }

  // graphics

  static failed(entry) {
    this.record(`${figures.cross} ${entry}`, 'red');
  }

  static err(entry) {
    console.log(`${chalk.red(entry)}`);
  }

  static ok(entry) {
    this.record(`${figures.tick} ${entry}`, 'green');
  }

  static box(entry) {
    console.log(boxen(`${chalk.gray(entry)}`, {padding: 1, borderColor: 'yellow', borderStyle: 'classic', dimBorder: true}));
  }

}

module.exports = Logger;
