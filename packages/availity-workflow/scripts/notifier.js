const updateNotifier = require('update-notifier');
const chalk = require('chalk');
const Logger = require('availity-workflow-logger');

const pkg = require('../package.json');

const options = {
  pkg,
  callback(err, update) {

    if (!update) {
      return;
    }

    if (update.type !== 'latest') {
      const message = chalk.bold.black('UPDATE AVAILABLE');
      Logger.warn(`${chalk.bold.bgYellow(message)} ${chalk.bold.green(update.latest)} (current: ${update.current}). Run ${chalk.blue('npm install availity-workflow@latest -D')}.`);
    }

  }
};

module.exports = function notifier() {
  return new updateNotifier.UpdateNotifier(options);
};
