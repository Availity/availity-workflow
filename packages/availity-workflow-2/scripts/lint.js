const _ = require('lodash');
const Promise = require('bluebird');
const chalk = require('chalk');
const Logger = require('availity-workflow-logger');
const settings = require('availity-workflow-settings-2');

const lintCmd = _.get(settings, 'lint', {});
const lint = {
  command: 'lint',
  desc: `${chalk.dim('Lint source files')}`,
  handler: () => {
    Logger.failed('Command not defined');
    return Promise.reject();
  }
};
if (_.isFunction(lintCmd)) {
  lint.handler = lintCmd;
} else if (_.isFunction(lintCmd.handler)) {
  lint.handler = lintCmd.handler;
}
if (lintCmd.desc) {
  lint.desc = lintCmd.desc;
}
if (lintCmd.builder) {
  lint.builder = lintCmd.builder;
}

module.exports = lint;
