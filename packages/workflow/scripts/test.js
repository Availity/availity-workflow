/* eslint-disable unicorn/no-process-exit */
/* eslint-disable global-require */


module.exports = {
  description: 'Run your tests',
  run: () => {
    const plugin = require('./plugin');
    const tester = plugin('test');
    process.env.NODE_ENV = 'test';
    return tester.run().then(exitCode => {
      if (Number.isInteger(exitCode)) {
        process.exit(exitCode);
      }
      return exitCode;
    });
  }
};
