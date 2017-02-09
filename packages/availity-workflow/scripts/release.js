'use strict';

const del = require('del');
const settings = require('availity-workflow-settings');
const Logger = require('availity-workflow-logger');

const version = require('./version');
const lint = require('./lint');
const build = require('./build');


function release() {

  if (!settings.isDryRun()) {
    del.sync([settings.dest()]);
  }

  return version.prompt()
    .then(() =>{
      Logger.info('Started releasing');
    })
    .then(lint)
    .then(version.bump)
    .then(build)
    .then(version.tag)
    .then(() => {
      Logger.ok('Finished releasing');
    })
    .catch(() => {
      Logger.fail('Failed releasing');
    });

}

module.exports = release;

