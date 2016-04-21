var path = require('path');
var karma = require('karma');

var context = require('../context');
var logger = require('../logger');

function continous() {

  return new Promise(function(resolve, reject) {

    logger.info('Started testing');

    process.env.NODE_ENV = 'testing';

    var server = new karma.Server({
      configFile: path.join(__dirname, '../karma/karma.conf.js'),
      autoWatch: false,
      singleRun: true
    }, function(exitStatus) {

      if (exitStatus) {
        logger.fail('Failed testing');
        reject();
      }else {
        logger.ok('Finished testing');
        resolve();
      }
    });

    server.start();

  });

}


function debug() {

  return new Promise(function(resolve, reject) {

    process.env.NODE_ENV = 'debug';

    var server = new karma.Server({
      configFile: path.join(__dirname, '../karma/karma.conf.js'),
      browsers: ['Chrome'],
      reporters: ['progress'],
      autoWatch: true,
      singleRun: false
    }, function(exitStatus) {

      if (exitStatus) {
        reject();
      }else {
        resolve();
      }

    });

    server.start();

  });

}

module.exports = {
  debug: debug,
  continous: continous
};

