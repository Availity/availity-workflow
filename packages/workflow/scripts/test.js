/* eslint-disable unicorn/no-process-exit */
// eslint-disable-next-line import/extensions
import webpackConfig from '../jest.config.js';

function runJest({ settings }) {
  const tester = webpackConfig(settings);
  process.env.NODE_ENV = 'test';
  return tester.run().then((exitCode) => {
    if (Number.isInteger(exitCode)) {
      process.exit(exitCode);
    }
    return exitCode;
  });
}

async function runVitest({ settings }) {
  process.env.NODE_ENV = 'test';
  const { startVitest } = await import('vitest/node');
  const { default: createVitestConfig } = await import('../vitest.config.js');

  const vitestConfig = createVitestConfig(settings);

  const vitest = await startVitest('test', [], vitestConfig);

  if (!vitest) {
    process.exit(1);
  }

  await vitest.close();
}

export default {
  description: 'Run your tests',
  run: ({ settings }) => {
    if (settings.testRunner() === 'vitest') {
      return runVitest({ settings });
    }
    return runJest({ settings });
  }
};
