const _ = require('lodash');
const Promise = require('bluebird');
const chalk = require('chalk');
const Logger = require('availity-workflow-logger');
const settings = require('availity-workflow-settings-2');

const testCmd = _.get(settings, 'test', {});
const test = {
  command: 'test',
  desc: `${chalk.dim('Start the development server')}`,
  handler: () => {
    Logger.failed('Command not defined');
    return Promise.reject();
  }
};
if (_.isFunction(testCmd)) {
  test.handler = testCmd;
} else if (_.isFunction(testCmd.handler)) {
  test.handler = testCmd.handler;
}
if (testCmd.desc) {
  test.desc = testCmd.desc;
}
if (testCmd.builder) {
  test.builder = testCmd.builder;
}

module.exports = test;
