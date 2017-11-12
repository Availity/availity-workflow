const Logger = require('availity-workflow-logger');
const settings = require('availity-workflow-settings');
const path = require('path');
const exists = require('exists-sync');
const karma = require('karma');

function validate() {
  const specExists = exists(path.join(settings.app(), 'specs-bundle.js'));

  if (!specExists) {
    Logger.failed(
      'Missing specs-bundle.js that is required by Karma to run the unit tests.'
    );
    throw Error();
  }

  return Promise.resolve(specExists);
}

function integration() {
  return new Promise((resolve, reject) => {
    Logger.info('Started testing');

    const server = new karma.Server(
      {
        configFile: path.join(__dirname, './karma.conf.sauce.js'),
        autoWatch: false,
        singleRun: true,
      },
      function(exitStatus) {
        if (exitStatus) {
          Logger.failed('Failed testing');
          reject(exitStatus);
        } else {
          Logger.success('Finished testing');
          resolve(exitStatus);
        }
      }
    );

    server.start();
  });
}

function unit() {
  return new Promise((resolve, reject) => {
    Logger.info('Started testing');

    const server = new karma.Server(
      {
        configFile: path.join(__dirname, './karma.conf.js'),
        autoWatch: false,
        singleRun: true,
      },
      function(exitStatus) {
        if (exitStatus) {
          Logger.failed('Failed testing');
          reject(exitStatus);
        } else {
          Logger.success('Finished testing');
          resolve(exitStatus);
        }
      }
    );

    server.start();
  });
}

function watch() {
  return new Promise((resolve, reject) => {
    const config = {
      configFile: path.join(__dirname, './karma.conf.js'),
      browsers: ['Chrome'],
      autoWatch: true,
      singleRun: false,
    };

    const server = new karma.Server(config, exitStatus => {
      if (exitStatus) {
        Logger.failed('Failed testing');
        reject(exitStatus);
      } else {
        Logger.success('Finished testing');
        resolve(exitStatus);
      }
    });

    server.start();
  });
}

module.exports = {
  run() {
    if (settings.isWatch()) {
      return watch();
    } else if (settings.isIntegrationTesting()) {
      return integration();
    }

    return validate().then(unit);
  },

  description: 'Run your tests using Karma and Chrome, IE or Firefox.  ',
};
