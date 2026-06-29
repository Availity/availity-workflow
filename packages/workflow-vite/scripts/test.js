import { startVitest } from 'vitest/node';
import createVitestConfig from '../vitest.config.js';

export default async function test({ settings }) {
  process.env.NODE_ENV = 'test';

  const vitestConfig = createVitestConfig(settings);
  const { test: testOptions, ...viteOverrides } = vitestConfig;

  const argv = settings.argv();
  testOptions.watch = Boolean(argv.watch);

  if (argv.coverage) {
    testOptions.coverage = { ...testOptions.coverage, enabled: true };
  }
  if (argv.reporter) {
    testOptions.reporters = [argv.reporter];
  }
  if (argv.changed) {
    testOptions.changed = argv.changed === true ? 'HEAD' : argv.changed;
  }
  if (argv.bail) {
    testOptions.bail = typeof argv.bail === 'number' ? argv.bail : 1;
  }
  if (argv.silent) {
    testOptions.silent = true;
  }

  const vitest = await startVitest(argv.watch ? 'watch' : 'test', [], testOptions, {
    ...viteOverrides,
    configFile: false,
  });

  if (!vitest) {
    throw new Error('Vitest failed to start');
  }

  await vitest.close();
}
