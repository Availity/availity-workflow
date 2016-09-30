'use strict';

const availityLogo = require('./availity');
const Logger = require('../logger');

function about() {
  Logger.simple(availityLogo);
}

module.exports = about;
