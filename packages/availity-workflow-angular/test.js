const settings = require('availity-workflow-settings');

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

    process.env.NODE_ENV = 'testing';

    const server = new karma.Server({
      configFile: path.join(__dirname, './karma.conf.js'),
      autoWatch: false,
      singleRun: true
    }, function(exitStatus) {

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
    .then(ci);
}

function test() {

  const argv = process.argv.slice(2);
  const jestConfig = JSON.stringify(create());
  argv.push(`--config=${jestConfig}`);
  argv.push('--env=jsdom');

  jest.run(argv);

}

function debug() {

  return new Promise( (resolve, reject) => {

    process.env.NODE_ENV = 'debug';

    const server = new karma.Server({
      configFile: path.join(__dirname, './karma.conf.js'),
      browsers: ['Chrome'],
      reporters: ['progress'],
      autoWatch: true,
      singleRun: false
    }, function(exitStatus) {

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
  test,
  debug,
  description: 'Run your tests using Jest'
};

