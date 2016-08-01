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
      Logger.warn(`${chalk.bold.bgYellow('UPDATE AVAILABLE')} ${chalk.bold.green(update.latest)} (current: ${update.current}). Run ${chalk.blue('npm install availity-workflow -D')}.`);
    }
  }
};

module.exports = function notifier() {
  return new UpdateNotifier(options);
};
