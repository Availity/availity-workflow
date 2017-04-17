const _ = require('lodash');
const Promise = require('bluebird');
const chalk = require('chalk');
const Logger = require('availity-workflow-logger');
const settings = require('availity-workflow-settings-2')();

const buildCmd = _.get(settings, 'build', {});
const build = {
  command: 'build',
  desc: `${chalk.dim('Bundle project')}`,
  handler: () => {
    Logger.failed('Command not defined');
    return Promise.reject();
  }
};
if (_.isFunction(buildCmd)) {
  build.handler = buildCmd;
} else if (_.isFunction(buildCmd.handler)) {
  build.handler = buildCmd.handler;
}
if (buildCmd.desc) {
  build.desc = buildCmd.desc;
}
if (buildCmd.builder) {
  build.builder = buildCmd.builder;
}

module.exports = build;
