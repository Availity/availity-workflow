const opn = require('opn');
const Promise = require('bluebird');
const chalk = require('chalk');

const settings = require('availity-workflow-settings');
const Logger = require('availity-workflow-logger');

function open() {

  if (settings.config().development.open) {

    const port = settings.config().development.port;
    const url = settings.config().development.open;

    const uri = `http://localhost:${port}/${url}`;

    try {
      opn(uri);
      Logger.info(`Opening browser at ${chalk.green(uri)}`);
    } catch (err) {
      // Ignore errors.
    }

  }

  return Promise.resolve(true);
}

module.exports = open;
