const plugin = require('./plugin');
const tester = plugin('test');

process.env.NODE_ENV = 'testing';

module.exports = {
  description: tester.description,
  run: tester.run
};

