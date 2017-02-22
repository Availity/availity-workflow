const Logger = require('availity-workflow-logger');
const settings = require('availity-workflow-settings');
const path = require('path');
const exists = require('exists-sync');
const karma = require('karma');
const ora = require('ora');

function validate() {

  const specExists = exists(path.join(settings.app(), 'specs.js'));

  if (!specExists) {
    Logger.failed('Missing specs.js that is required by Karma to run the unit tests.');
    throw Error();
  }

  return Promise.resolve(specExists);

}

function ci() {

  return new Promise( (resolve, reject) => {

    Logger.info('Started testing');
    const spinner = ora('Running webpack and karma');
    spinner.color = 'yellow';
    spinner.start();

    const server = new karma.Server({
      configFile: path.join(__dirname, './karma.conf.js'),
      autoWatch: false,
      singleRun: true
    }, function(exitStatus) {

      spinner.stop();

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

function continous() {
  return validate()
    .then(ci)
    .then(() => { /* eslint no-process-exit: 0 */ process.exit(0) });
}

function debug() {

  return new Promise( (resolve, reject) => {

    const config = {
      configFile: path.join(__dirname, './karma.conf.js'),
      browsers: ['Chrome'],
      reporters: ['progress'],
      autoWatch: true,
      singleRun: false
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
  run: continous,
  debug,
  description: 'Run your tests using Karma and Phantom.js'
};

