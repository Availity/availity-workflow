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
  const includes = ['@av', 'axios', '@tanstack', 'is-what', 'copy-anything', 'dayjs', ...userInclude].join('|');

  const globals = settings.globals();
  const define = {};
  for (const [key, value] of Object.entries(globals)) {
    define[key] = typeof value === 'string' ? value : JSON.stringify(value);
  }

  const config = {
    root: rootDir,
    define,
    // Explicitly exclude `module-sync` from resolve conditions.
    // Node 22 introduced the `module-sync` condition for synchronous ESM loading in CJS contexts.
    // With vmThreads on Linux + Node 22, Vitest resolves `module-sync` → a .mjs file, then tries
    // to require() it — which fails with SyntaxError. Omitting it forces the `import` or `default`
    // condition instead. Consumers can override via `development.resolveConditions` in workflow.js.
    resolve: {
      alias: { '@/': `${settings.app()}/` },
      conditions: settings.configuration.development.resolveConditions ?? ['browser', 'module', 'import', 'default'],
    },
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
      // Vitest 5 changed clearMocks default from false to true.
      // We keep false here to preserve the existing behavior for consumers upgrading.
      // Consumers who want auto-clearing between tests can set vitestOverrides.clearMocks: true.
      clearMocks: false,
      coverage: {
        enabled: false,
        provider: 'v8',
        reporter: ['text', 'cobertura', 'lcov'],
        reportsDirectory: './reports',
        include: ['project/app/**/*.{js,jsx,ts,tsx}'],
        exclude: ['node_modules/', 'coverage/', 'dist/', 'build/'],
      },
      deps: {
        optimizer: { web: { enabled: true } },
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

  // Merge compatible jest overrides (legacy support)
  const userJestOverrides = settings.configuration.development.jestOverrides;
  if (userJestOverrides && Object.keys(userJestOverrides).length > 0) {
    const { collectCoverageFrom, coveragePathIgnorePatterns, testTimeout } = userJestOverrides;
    if (collectCoverageFrom) config.test.coverage.include = collectCoverageFrom;
    if (coveragePathIgnorePatterns) config.test.coverage.exclude = coveragePathIgnorePatterns;
    if (testTimeout) config.test.testTimeout = testTimeout;
  }

  // Apply structured vitestOverrides — additive merging for safe customization.
  // See packages/workflow/vitest.config.js for full documentation of supported options.
  // Coverage accepts all vitest coverage options (e.g. all, provider, thresholds, reporter).
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

    if (pool) config.test.pool = pool;
    if (environment) config.test.environment = environment;
    if (vTestTimeout) config.test.testTimeout = vTestTimeout;

    if (userSetupFiles) {
      const files = Array.isArray(userSetupFiles) ? userSetupFiles : [userSetupFiles];
      config.test.setupFiles.push(...files);
    }

    if (inlineDeps) {
      const deps = Array.isArray(inlineDeps) ? inlineDeps : [inlineDeps];
      config.test.server.deps.inline.push(...deps);
    }

    if (fallbackCJS !== undefined) {
      config.test.server.deps.fallbackCJS = fallbackCJS;
    }

    if (optimizeDeps) {
      const deps = Array.isArray(optimizeDeps) ? optimizeDeps : [optimizeDeps];
      const existing = config.test.deps.optimizer.web.include || [];
      config.test.deps.optimizer.web.include = [...existing, ...deps];
    }

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

    if (Object.keys(rest).length > 0) {
      Object.assign(config.test, rest);
    }
  }

  return config;
}

export default create;
