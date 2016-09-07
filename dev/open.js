'use strict';

const opn = require('opn');
const Promise = require('bluebird');
const chalk = require('chalk');

const settings = require('../settings');
const Logger = require('../logger');

function open() {

  if (settings.config().development.open) {

    const port = settings.config().development.port;
    const url = settings.config().development.open;

    const uri = `http://localhost:${port}/${url}`;

    opn(uri);
    Logger.info(`Opening browser at ${chalk.green(uri)}`);

  }

  return Promise.resolve(true);
}

module.exports = open;
