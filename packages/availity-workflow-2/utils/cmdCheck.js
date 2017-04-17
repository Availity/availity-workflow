const _ = require('lodash');
const Promise = require('bluebird');

module.exports = (cmd) => {
  const output = _.cloneDeep(cmd);
  if (output.handler) {
    const fn = output.handler;
    output.handler = () => {
      return Promise.resolve(fn()).catch(err => {});
    };
  }
  return output;
}
