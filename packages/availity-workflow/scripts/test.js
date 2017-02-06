const Promise = require('bluebird');

const plugin = require('./plugin');

Promise.config({
  longStackTraces: true
});

function test() {
  const tester = plugin('test');
  return tester();
}

module.exports = {
  description: 'Run your test using Jest',
  run: test
};

