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

  // jest.init.js is a legacy hook that exports an array of setup module paths.
  // Collect them separately so they're appended after the primary setup files.
  const jestInitSetupFiles = [];
  if (jestInitExists) {
    // jest.init.js exports an array of setup modules
    const initModules = require(jestInitPath);
    if (Array.isArray(initModules)) {
      jestInitSetupFiles.push(...initModules);
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
    esbuild: {
      jsx: 'automatic',
      jsxImportSource: 'react',
    },
    // Explicitly exclude `module-sync` from resolve conditions.
    // Node 22 introduced the `module-sync` condition for synchronous ESM loading in CJS contexts.
    // With vmThreads on Linux + Node 22, Vitest resolves `module-sync` → a .mjs file, then tries
    // to require() it — which fails with SyntaxError. Omitting it forces the `import` or `default`
    // condition instead. Consumers can override via `development.resolveConditions` in workflow.js.
    resolve: {
      alias: {
        '@/': `${settings.app()}/`,
      },
      conditions: settings.configuration.development.resolveConditions ?? ['browser', 'module', 'import', 'default'],
    },
    test: {
      globals: true,
      environment: 'jsdom',

      // vmThreads reuses worker threads with VM isolation — significantly faster than
      // the default forks pool which spawns new processes per test file
      pool: 'vmThreads',

      setupFiles: [...setupFiles, ...jestInitSetupFiles],
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

      // Vitest 5 changed clearMocks default from false to true.
      // We keep false here to preserve the existing behavior for consumers upgrading.
      // Consumers who want auto-clearing between tests can set vitestOverrides.clearMocks: true.
      clearMocks: false,

      // Coverage runs only when --coverage is passed, not by default.
      // v8 provider is the fastest option (native V8 coverage, no instrumentation).
      coverage: {
        enabled: false,
        provider: 'v8',
        reporter: ['text', 'cobertura', 'lcov'],
        reportsDirectory: './reports',
        include: ['project/app/**/*.{js,jsx,ts,tsx}'],
        exclude: ['node_modules/', 'coverage/', 'dist/', 'build/'],
      },
      deps: {
        // Pre-bundle test dependencies for faster startup
        optimizer: {
          client: {
            enabled: true,
          },
        },
      },
      // server.deps is deprecated in Vitest 5 but still functional.
      // server.deps.inline routes packages through Vite's transform pipeline so they
      // are processed as ESM. server.deps.fallbackCJS guesses a CJS build for packages
      // with confusing ESM/CJS packaging (e.g. dayjs which has no exports map).
      server: {
        deps: {
          inline: [new RegExp(`node_modules[/\\\\](?=(${includes})).*`)],
          // Try CJS fallback for packages with invalid ESM (like dayjs which has no exports map)
          fallbackCJS: true,
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
  //   resolveConditions - override the resolve conditions list (replaces the default)
  //   coverage        - all vitest coverage options (merged with defaults)
  //                     e.g. { include, exclude, all, provider, thresholds, reporter, ... }
  //
  // Example in workflow.js:
  //   config.development.vitestOverrides = {
  //     testTimeout: 15000,
  //     inlineDeps: ['some-cjs-package', /my-esm-pattern/],
  //     setupFiles: ['./test/my-global-setup.js'],
  //     coverage: {
  //       all: true,
  //       provider: 'istanbul',
  //       thresholds: { statements: 80 },
  //     },
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
      resolveConditions,
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
      const existing = config.test.deps.optimizer.client.include || [];
      config.test.deps.optimizer.client.include = [...existing, ...deps];
    }

    // Additive: test exclusion globs
    if (exclude) {
      const globs = Array.isArray(exclude) ? exclude : [exclude];
      config.test.exclude.push(...globs);
    }

    // Override: resolve conditions (replaces the default module-sync workaround list)
    if (resolveConditions) {
      config.resolve.conditions = Array.isArray(resolveConditions) ? resolveConditions : [resolveConditions];
    }

    // Override: coverage options (merged with defaults — user values win)
    if (coverage) {
      config.test.coverage = { ...config.test.coverage, ...coverage };
    }

    // Escape hatch: any remaining keys are spread directly (use with caution)
    if (Object.keys(rest).length > 0) {
      Object.assign(config.test, rest);
    }
  }

  return config;
}

export default create;
