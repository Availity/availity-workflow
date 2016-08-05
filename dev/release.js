'use strict';

const del = require('del');
const settings = require('../settings');
const version = require('./version');
const lint = require('./lint');
const build = require('./build');
const Logger = require('../logger');

function release() {

  del.sync([settings.dest()]);

  return version.prompt()
    .then(function() {
      Logger.info('Started releasing');
    })
    .then(lint)
    .then(version.bump)
    .then(build)
    .then(version.tag)
    .then(function() {
      Logger.ok('Finished releasing');
    })
    .catch(function() {
      Logger.fail('Failed releasing');
    });

}

module.exports = release;


