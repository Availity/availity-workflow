const plugin = require('./plugin');
const tester = plugin('test');

module.exports = {
  description: tester.description,
  run: () => {
    process.env.NODE_ENV = 'testing';
    tester.run();
  }
};

