import { createRequire } from 'node:module';
import path from 'node:path';
import { existsSync } from 'node:fs';

const require = createRequire(import.meta.url);

function create(settings) {
  const rootDir = settings.project();

  // Check for setup files (same logic as jest.config.js)
  const setupFilesPath = path.join(rootDir, 'jest.setup.js');
  const setupFilesExist = existsSync(setupFilesPath);
  const jestInitPath = path.join(settings.app(), 'jest.init.js');
  const jestInitExists = existsSync(jestInitPath);

  const setupFiles = [];

  // Auto-register @testing-library/jest-dom matchers if installed
  try {
    require.resolve('@testing-library/jest-dom/vitest');
    setupFiles.push('@testing-library/jest-dom/vitest');
  } catch {
    // not installed — skip
  }

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
  const includes = ['@av', 'axios', '@tanstack', 'is-what', 'copy-anything', 'dayjs', ...userInclude].join('|');

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
        '@/': `${settings.app()}/`,
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',

      // vmThreads reuses worker threads with VM isolation — significantly faster than
      // the default forks pool which spawns new processes per test file
      pool: 'vmThreads',

      setupFiles: [...setupFiles, ...setupFilesAfterEnv],
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
        exclude: ['node_modules/', 'coverage/', 'dist/', 'build/'],
      },
      // Equivalent to Jest's transformIgnorePatterns — deps that need transformation.
      // In Vitest 4.x with vmThreads, server.deps.inline tells Vite to process these
      // modules through its transform pipeline rather than passing them to native Node.
      server: {
        deps: {
          inline: [new RegExp(`node_modules[/\\\\](?=(${includes})).*`)],
          // Try CJS fallback for packages with invalid ESM (like dayjs which has no exports map)
          fallbackCJS: true,
        },
      },
      deps: {
        // Pre-bundle test dependencies for faster startup
        optimizer: {
          web: {
            enabled: true,
          },
        },
      },
    },
  };

  // Merge in user jest overrides that are compatible with vitest (legacy support)
  const userJestOverrides = settings.configuration.development.jestOverrides;
  if (userJestOverrides && Object.keys(userJestOverrides).length > 0) {
    const { collectCoverageFrom, coveragePathIgnorePatterns, testTimeout } = userJestOverrides;
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

  // Apply structured vitestOverrides — additive merging for safe customization.
  //
  // Supported options (all are additive or override-safe):
  //   pool            - 'vmThreads' (default) | 'forks' | 'threads'
  //   environment     - 'jsdom' (default) | 'happy-dom' | 'node'
  //   testTimeout     - milliseconds (default: vitest default 5000)
  //   setupFiles      - additional setup files (appended to internal list)
  //   inlineDeps      - additional packages to inline (appended to internal list)
  //   fallbackCJS     - true (default) | false
  //   optimizeDeps    - additional packages to pre-bundle (appended to internal list)
  //   exclude         - additional test file exclusion globs (appended to internal list)
  //   coverage        - { include, exclude } overrides for coverage paths
  //
  // Example in workflow.js:
  //   config.development.vitestOverrides = {
  //     testTimeout: 15000,
  //     inlineDeps: ['some-cjs-package', /my-esm-pattern/],
  //     setupFiles: ['./test/my-global-setup.js'],
  //   };
  //
  const { vitestOverrides } = settings.configuration.development;
  if (vitestOverrides && Object.keys(vitestOverrides).length > 0) {
    const {
      pool,
      environment,
      testTimeout: vTestTimeout,
      setupFiles: userSetupFiles,
      inlineDeps,
      fallbackCJS,
      optimizeDeps,
      exclude,
      coverage,
      ...rest
    } = vitestOverrides;

    // Simple overrides
    if (pool) config.test.pool = pool;
    if (environment) config.test.environment = environment;
    if (vTestTimeout) config.test.testTimeout = vTestTimeout;

    // Additive: setup files
    if (userSetupFiles) {
      const files = Array.isArray(userSetupFiles) ? userSetupFiles : [userSetupFiles];
      config.test.setupFiles.push(...files);
    }

    // Additive: inline deps (appended to internal server.deps.inline list)
    if (inlineDeps) {
      const deps = Array.isArray(inlineDeps) ? inlineDeps : [inlineDeps];
      config.test.server.deps.inline.push(...deps);
    }

    // Override: CJS fallback toggle
    if (fallbackCJS !== undefined) {
      config.test.server.deps.fallbackCJS = fallbackCJS;
    }

    // Additive: optimizer pre-bundle list
    if (optimizeDeps) {
      const deps = Array.isArray(optimizeDeps) ? optimizeDeps : [optimizeDeps];
      const existing = config.test.deps.optimizer.web.include || [];
      config.test.deps.optimizer.web.include = [...existing, ...deps];
    }

    // Additive: test exclusion globs
    if (exclude) {
      const globs = Array.isArray(exclude) ? exclude : [exclude];
      config.test.exclude.push(...globs);
    }

    // Override: coverage paths
    if (coverage) {
      if (coverage.include) config.test.coverage.include = coverage.include;
      if (coverage.exclude) config.test.coverage.exclude = coverage.exclude;
    }

    // Escape hatch: any remaining keys are spread directly (use with caution)
    if (Object.keys(rest).length > 0) {
      Object.assign(config.test, rest);
    }
  }

  return config;
}

export default create;
