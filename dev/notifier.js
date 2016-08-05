'use strict';

const UpdateNotifier = require('update-notifier');
const chalk = require('chalk');

const pkg = require('../package.json');
const Logger = require('../logger');

const options = {
  pkg,
  callback(err, update) {

    if (!update) {
      return;
    }

    if (update.type !== 'latest') {
      const message = chalk.bold.black('UPDATE AVAILABLE');
      Logger.warn(`${chalk.bold.bgYellow(message)} ${chalk.bold.green(update.latest)} (current: ${update.current}). Run ${chalk.blue('npm install availity-workflow -D')}.`);
    }
  }
};

module.exports = function notifier() {
  return new UpdateNotifier(options);
};
