const _ = require('lodash');
const Promise = require('bluebird');
const Ekko = require('availity-ekko');
const opn = require('opn');
const chalk = require('chalk');

const settings = require('availity-workflow-settings-2');
const Logger = require('availity-workflow-logger');

const web = require('./web');

let useSettings;

function rest() {
  const ekkoOptions = _.get(useSettings, 'ekko');
  if (!ekkoOptions || !ekkoOptions.enabled) {
    return Promise.resolve();
  }
  const ekko = new Ekko();
  return ekko.start(ekkoOptions)
  .then(() => {
    return `http://localhost:${ekko.config().server.address().port}`;
  });
}

function open() {
  const options = useSettings.options;
  const openOpt = options.open;
  if (openOpt) {
    try {
      let uri = openOpt.startsWith('http') ? openOpt : `http://localhost:${options.port}/${openOpt}`;
      uri.replace(/[\/]+/g, '/');
      opn(uri);
      Logger.info(`Opening browser at ${chalk.green(uri)}`);
    } catch(err) {
      // Ignore errors.
    }
  }
}

module.exports = () => {
  useSettings = settings();
  return rest()
  .then(web)
  .then(open);
}
