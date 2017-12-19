const plugin = require('./plugin');

const tester = plugin('test');

module.exports = {
  description: tester.description,
  run: () => {
    process.env.NODE_ENV = 'test';
    return tester.run().then(exitCode => {
      if (Number.isInteger(exitCode)) {
        /* eslint no-process-exit:0 */
        process.exit(exitCode);
      }
      return exitCode;
    });
  }
};
