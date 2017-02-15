const plugin = require('./plugin');
const tester = plugin('test');

module.exports = {
  description: tester.description,
  run: tester.run
};

