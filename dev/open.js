'use strict';

const opn = require('opn');
const Promise = require('bluebird');

const settings = require('../settings');
const Logger = require('../logger');

function open() {

  if (settings.open) {

    Logger.info('Started opening application in browser');

    const port = settings.servers.app.port;
    const url = settings.open;

    const uri = `http://localhost:${port}/${url}`;

    opn(uri);
    Logger.ok('Finished opening application in browser');

  }

  return Promise.resolve(true);
}

module.exports = open;
