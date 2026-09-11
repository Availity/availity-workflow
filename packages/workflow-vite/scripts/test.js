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
    const bailCount = Number(argv.bail);
    testOptions.bail = Number.isNaN(bailCount) ? 1 : bailCount;
  }
  if (argv.silent) {
    testOptions.silent = true;
  }
  if (argv.ui) {
    testOptions.ui = true;
    testOptions.watch = true;
  }

  // Forward positional args (argv._) as file filters so users can run specific tests:
  //   av test project/app/App.test.tsx
  const fileFilters = (argv._ || []).filter((arg) => arg !== 'test');

  const vitest = await startVitest(argv.watch || argv.ui ? 'watch' : 'run', fileFilters, testOptions, {
    ...viteOverrides,
    configFile: false,
  });

  if (!vitest) {
    throw new Error('Vitest failed to start');
  }

  await vitest.close();

  // In run mode, exit with a non-zero code if any tests failed so that CI pipelines
  // correctly detect failures. Watch/UI mode stays alive so we don't force-exit.
  if (!argv.watch && !argv.ui) {
    const failed = vitest.state?.getFiles().some((f) => f.result?.state === 'fail');
    // eslint-disable-next-line unicorn/no-process-exit
    if (failed) process.exit(1);
  }
}
