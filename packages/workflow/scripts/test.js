/* eslint-disable unicorn/no-process-exit */
/* eslint-disable global-require */

const webpackConfig = require('../jest.config.js');

module.exports = {
  description: 'Run your tests',
  run: ({ settings }) => {
    const tester = webpackConfig(settings);
    process.env.NODE_ENV = 'test';
    return tester.run().then(exitCode => {
      if (Number.isInteger(exitCode)) {
        process.exit(exitCode);
      }
      return exitCode;
    });
  }
};
