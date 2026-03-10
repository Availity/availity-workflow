import { createRequire } from 'module';
import path from 'path';
import { existsSync } from 'fs';

const require = createRequire(import.meta.url);

function create(settings) {
  const rootDir = settings.project();

  // Check for setup files (same logic as jest.config.js)
  const setupFilesPath = path.join(rootDir, 'jest.setup.js');
  const setupFilesExist = existsSync(setupFilesPath);
  const jestInitPath = path.join(settings.app(), 'jest.init.js');
  const jestInitExists = existsSync(jestInitPath);

  const setupFiles = [];
  if (setupFilesExist) {
    setupFiles.push(setupFilesPath);
  }

  const setupFilesAfterEnv = [];
  if (jestInitExists) {
    // jest.init.js exports an array of setup modules
    const initModules = require(jestInitPath);
    if (Array.isArray(initModules)) {
      setupFilesAfterEnv.push(...initModules);
    }
  }

  // Allow developers to add their own node_modules include path
  const userInclude = settings.configuration.development.babelInclude;
  const includes = ['@av', 'axios', '@tanstack', 'is-what', 'copy-anything', ...userInclude].join('|');

  // Build define map from settings.globals()
  const globals = settings.globals();
  const define = {};
  for (const [key, value] of Object.entries(globals)) {
    define[key] = typeof value === 'string' ? value : JSON.stringify(value);
  }

  const config = {
    root: rootDir,
    define,
    resolve: {
      alias: {
        '@/': `${settings.app()}/`
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',

      // vmThreads reuses worker threads with VM isolation — significantly faster than
      // the default forks pool which spawns new processes per test file
      pool: 'vmThreads',

      setupFiles,
      // Vitest equivalent of setupFilesAfterEnv
      ...(setupFilesAfterEnv.length > 0 ? { setupFiles: [...setupFiles, ...setupFilesAfterEnv] } : {}),
      include: [
        '!(build|docs|dist|node_modules|scripts)/**/__tests__/**/*.(js|ts|tsx)?(x)',
        '!(build|docs|dist|node_modules|scripts)/**/*(*.)(spec|test).(js|ts|tsx)?(x)'
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
        'wiremock/**'
      ],

      // Skip CSS processing entirely in tests — jest returns empty objects for CSS imports,
      // this is the faster equivalent (no parsing at all)
      css: false,

      // Coverage runs only when --coverage is passed, not by default.
      // v8 provider is the fastest option (native V8 coverage, no instrumentation).
      coverage: {
        enabled: false,
        provider: 'v8',
        reportsDirectory: './reports',
        include: ['project/app/**/*.{js,jsx,ts,tsx}'],
        exclude: ['node_modules/', 'coverage/', 'dist/', 'build/']
      },
      // Equivalent to Jest's transformIgnorePatterns — deps that need transformation
      deps: {
        inline: [new RegExp(`node_modules[/\\\\](?=(${includes})).*`)],
        // Pre-bundle test dependencies for faster startup
        optimizer: {
          web: {
            enabled: true
          }
        }
      }
    }
  };

  // Merge in user jest overrides that are compatible with vitest
  const userJestOverrides = settings.configuration.development.jestOverrides;
  if (userJestOverrides && Object.keys(userJestOverrides).length > 0) {
    // Only merge test-related overrides that are vitest-compatible
    // eslint-disable-next-line no-unused-vars
    const { collectCoverageFrom, coveragePathIgnorePatterns, testTimeout, ...rest } = userJestOverrides;
    if (collectCoverageFrom) {
      config.test.coverage.include = collectCoverageFrom;
    }
    if (coveragePathIgnorePatterns) {
      config.test.coverage.exclude = coveragePathIgnorePatterns;
    }
    if (testTimeout) {
      config.test.testTimeout = testTimeout;
    }
  }

  return config;
}

export default create;
