const opn = require('opn');
const Promise = require('bluebird');
const chalk = require('chalk');

const settings = require('availity-workflow-settings');
const Logger = require('availity-workflow-logger');

function open() {

  if (settings.open()) {

    try {

      const port = settings.port();
      const url = settings.open();
      const host = settings.host();

      const uri = `http://${host}:${port}/${url}`;
      opn();
      Logger.info(`Opening browser at ${chalk.green(uri)}`);

    } catch (err) {
      // Ignore errors.
    }

  }

  return Promise.resolve(true);
}

module.exports = open;
