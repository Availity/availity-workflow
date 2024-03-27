/* eslint-disable unicorn/no-process-exit */

// eslint-disable-next-line import/extensions
import webpackConfig from '../jest.config.js';

export default {
  description: 'Run your tests',
  run: ({ settings }) => {
    const tester = webpackConfig(settings);
    process.env.NODE_ENV = 'test';
    return tester.run().then((exitCode) => {
      if (Number.isInteger(exitCode)) {
        process.exit(exitCode);
      }
      return exitCode;
    });
  }
};
