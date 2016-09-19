/* eslint no-console:0 */
'use strict';

const chalk = require('chalk');
const dateformat = require('dateformat');
const figures = require('figures');
const boxen = require('boxen');

class Logger {

  constructor(options) {
    this.options = options;
  }

  static warn(entry) {
    this._log(entry, 'yellow');
  }

  static error(entry) {
    this._log(entry, 'red');
  }

  static info(entry) {
    this._log(entry);
  }

  static log(entry) {
    this._log(entry);
  }

  // graphics

  static failed(entry) {
    this._log(`${figures.cross} ${entry}`, 'red');
  }

  static ok(entry) {
    this._log(`${figures.tick} ${entry}`, 'green');
  }

  static _log(entry, _color) {

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

  static box(entry) {
    console.log(boxen(`${chalk.gray(entry)}`, {padding: 1, borderColor: 'yellow', borderStyle: 'classic', dimBorder: true}));
  }

}

module.exports = Logger;
