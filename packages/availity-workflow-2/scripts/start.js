const _ = require('lodash');
const Promise = require('bluebird');
const Logger = require('availity-workflow-logger');
const settings = require('availity-workflow-settings-2');

const startCmd = _.get(settings, 'start', {});
const start = {
  command: 'start',
  desc: `${chalk.dim('Start the development server')}`,
  handler: () => {
    Logger.failed('Command not defined');
    return Promise.reject();
  }
};
if (_.isFunction(startCmd)) {
  start.handler = startCmd;
} else if (_.isFunction(startCmd.handler)) {
  start.handler = startCmd.handler;
}
if (startCmd.desc) {
  start.desc = startCmd.desc;
}
if (startCmd.builder) {
  start.builder = startCmd.builder;
}

module.exports = start;
