import { startVitest } from 'vitest/node';
import createVitestConfig from '../vitest.config.js';

async function runVitest({ settings }) {
  process.env.NODE_ENV = 'test';

  const argv = settings.argv();
  const vitestConfig = createVitestConfig(settings);

  const { test: testOptions = {}, ...viteOverrides } = vitestConfig;

  // Forward CLI flags to vitest
  if (argv.coverage) {
    testOptions.coverage = { ...testOptions.coverage, enabled: true };
  }

  const mode = argv.watch ? 'watch' : 'run';
  testOptions.watch = Boolean(argv.watch);

  const vitest = await startVitest(mode, [], testOptions, { ...viteOverrides, configFile: false });

  if (!vitest) {
    throw new Error('Vitest failed to start');
  }

  await vitest.close();
}

export default runVitest;
