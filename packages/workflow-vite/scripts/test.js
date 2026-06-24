import { startVitest } from 'vitest/node';
import createVitestConfig from '../vitest.config.js';

export default async function test({ settings }) {
  process.env.NODE_ENV = 'test';

  const vitestConfig = createVitestConfig(settings);
  const { test: testOptions, ...viteOverrides } = vitestConfig;

  const argv = settings.argv();
  const watch = Boolean(argv.watch);
  testOptions.watch = watch;

  const vitest = await startVitest('test', [], testOptions, { ...viteOverrides, configFile: false });

  if (!vitest) {
    throw new Error('Vitest failed to start');
  }

  await vitest.close();
}
