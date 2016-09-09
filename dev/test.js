'use strict';

const path = require('path');
const karma = require('karma');

const Logger = require('../logger');

function continous() {

  return new Promise( (resolve, reject) => {

    Logger.info('Started testing');

    process.env.NODE_ENV = 'testing';

    const server = new karma.Server({
      configFile: path.join(__dirname, '../karma/karma.conf.js'),
      autoWatch: false,
      singleRun: true
    }, function(exitStatus) {

      if (exitStatus) {
        Logger.failed('Failed testing');
        reject(exitStatus);
      } else {
        Logger.ok('Finished testing');
        resolve(exitStatus);
      }
    });

    server.start();

  });

}


function debug() {

  return new Promise( (resolve, reject) => {

    process.env.NODE_ENV = 'debug';

    const server = new karma.Server({
      configFile: path.join(__dirname, '../karma/karma.conf.js'),
      browsers: ['Chrome'],
      reporters: ['progress'],
      autoWatch: true,
      singleRun: false
    }, function(exitStatus) {

      if (exitStatus) {
        Logger.failed('Failed testing');
        reject(exitStatus);
      } else {
        Logger.ok('Finished testing');
        resolve(exitStatus);
      }

    });

    server.start();

  });

}

module.exports = {
  debug,
  continous
};

