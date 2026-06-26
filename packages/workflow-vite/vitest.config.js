import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

function create(settings) {
  const rootDir = settings.project();

  const setupFilesPath = path.join(rootDir, 'jest.setup.js');
  const jestInitPath = path.join(settings.app(), 'jest.init.js');

  const setupFiles = [];

  // Auto-register @testing-library/jest-dom matchers if installed
  try {
    require.resolve('@testing-library/jest-dom/vitest');
    setupFiles.push('@testing-library/jest-dom/vitest');
  } catch {
    // not installed — skip
  }

  if (existsSync(setupFilesPath)) setupFiles.push(setupFilesPath);
  if (existsSync(jestInitPath)) {
    const initModules = require(jestInitPath);
    if (Array.isArray(initModules)) setupFiles.push(...initModules);
  }

  const userInclude = settings.configuration.development.babelInclude;
  const includes = ['@av', 'axios', '@tanstack', 'is-what', 'copy-anything', ...userInclude].join('|');

  const globals = settings.globals();
  const define = {};
  for (const [key, value] of Object.entries(globals)) {
    define[key] = typeof value === 'string' ? value : JSON.stringify(value);
  }

  const config = {
    root: rootDir,
    define,
    resolve: { alias: { '@/': `${settings.app()}/` } },
    test: {
      globals: true,
      environment: 'jsdom',
      pool: 'vmThreads',
      setupFiles,
      include: [
        '!(build|docs|dist|node_modules|scripts)/**/__tests__/**/*.(js|ts|tsx)?(x)',
        '!(build|docs|dist|node_modules|scripts)/**/*(*.)(spec|test).(js|ts|tsx)?(x)',
      ],
      exclude: [
        '.vscode/**',
        '.yarn/**',
        'automated-tests/**',
        'dist/**',
        'infra/**',
        'node_modules/**',
        'observability/**',
        'scripts/**',
        'static/**',
        'wiremock/**',
      ],
      css: false,
      coverage: {
        enabled: false,
        provider: 'v8',
        reportsDirectory: './reports',
        include: ['project/app/**/*.{js,jsx,ts,tsx}'],
        exclude: ['node_modules/', 'coverage/', 'dist/', 'build/'],
      },
      deps: {
        inline: [new RegExp(`node_modules[/\\\\](?=(${includes})).*`)],
        optimizer: { web: { enabled: true } },
      },
    },
  };

  // Merge compatible jest overrides
  const userJestOverrides = settings.configuration.development.jestOverrides;
  if (userJestOverrides && Object.keys(userJestOverrides).length > 0) {
    const { collectCoverageFrom, coveragePathIgnorePatterns, testTimeout } = userJestOverrides;
    if (collectCoverageFrom) config.test.coverage.include = collectCoverageFrom;
    if (coveragePathIgnorePatterns) config.test.coverage.exclude = coveragePathIgnorePatterns;
    if (testTimeout) config.test.testTimeout = testTimeout;
  }

  // Apply vitestOverrides — merged directly into test config
  const {vitestOverrides} = settings.configuration.development;
  if (vitestOverrides && Object.keys(vitestOverrides).length > 0) {
    Object.assign(config.test, vitestOverrides);
  }

  return config;
}

export default create;
