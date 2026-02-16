/* eslint-disable no-console */
import chalk from 'chalk';
import boxen from 'boxen';

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

  static debug(entry) {
    this.record(entry);
  }

  static log(entry) {
    this.record(entry);
  }

  // › Started dev server
  static record(entry = '', color = '') {
    const defaultColor = entry instanceof Error ? 'red' : 'gray';
    const crayoloa = color || defaultColor;

    // Determine color of prefix log
    let delimeter = chalk.bold[crayoloa]('›');
    delimeter = `${delimeter}`;

    console.log(`${delimeter} ${chalk[crayoloa](entry)}`);
  }

  static simple(entry) {
    console.log(entry);
  }

  static empty() {
    console.log('');
  }

  // ✖ [ ERROR] Failed linting
  static failed(entry) {
    const prefix = chalk.red('✖');
    const label = chalk.white.bold(' ERROR ');
    console.log(`${prefix} ${chalk.bgRed(label)} ${chalk.red(entry)}`);
  }

  // ★ [ WARNING] Compiled with warnings
  static alert(entry) {
    const prefix = chalk.yellow('★');
    const label = chalk.black.bold(' WARNING ');
    console.log(`${prefix} ${chalk.bgYellow(label)} ${chalk.yellow(entry)}`);
  }

  static message(entry, entryLabel) {
    const prefix = chalk.blue('ℹ');
    entryLabel = entryLabel || 'INFO';
    const label = chalk.white.bold(` ${entryLabel} `);
    console.log(`${prefix} ${chalk.bgBlue(label)} ${chalk.blue(entry)}`);
  }

  // ✔︎ Finished linting
  static success(entry) {
    const prefix = chalk.green.bold('✔');
    console.log(`${prefix} ${chalk.gray(entry)}`);
  }

  static box(entry) {
    console.log(
      boxen(`${chalk.gray(entry)}`, {
        padding: 1,
        borderColor: 'yellow',
        borderStyle: 'classic',
        dimBorder: true
      })
    );
  }
}

export default Logger;
