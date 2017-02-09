const plugin = require('./plugin');

function test() {
  const tester = plugin('test');
  return tester();
}

module.exports = {
  description: 'Run your test using Jest',
  run: test
};

