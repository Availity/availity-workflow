var UpdateNotifier = require('update-notifier');
var chalk = require('chalk');

var pkg = require('../package.json');
var logger = require('../logger');

var options = {
  pkg: pkg,
  callback: function(err, update) {

    if (!update) {
      return;
    }

    if (update.type !== 'latest') {
      logger.warn(chalk.bold.bgYellow('UPDATE AVAILABLE') + chalk.bold.green(' ' + update.latest) + ' (current: %s).  Run {blue:npm update availity-workflow}.', update.current);
    }
  }
};

module.exports = function notifier() {
  return new UpdateNotifier(options);
};
