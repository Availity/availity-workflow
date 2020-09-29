const opn = require('open');
const chalk = require('chalk');
const urlJoin = require('url-join');
const Logger = require('@availity/workflow-logger');
const settings = require('../settings');

function open() {
  if (settings.open()) {
    try {
      const port = settings.port();
      const url = settings.open() || '';
      const host = settings.host();

      const uri = urlJoin(`http://${host}:${port}/`, url);
      opn(uri);
      Logger.info(`Opening browser at ${chalk.green(uri)}`);
    } catch {
      // Ignore errors.
    }
  }

  return Promise.resolve(true);
}

module.exports = open;
