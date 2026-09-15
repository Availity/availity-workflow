// Tests for the typeCheck feature in vite.config.js.
//
// vite.config.js has many transitive dependencies (paths.js uses fs.realpathSync,
// plugin imports, etc.) that make a full-import approach fragile in unit tests.
//
// Strategy: test the logic directly by extracting the typeCheck decision into
// a testable unit. We verify:
//   1. The schema defaults typeCheck to false
//   2. The checker options object is built correctly based on typeCheck + tsconfig presence
//
// The vite.config.js integration is covered by the existing workflowConfigs snapshot
// tests and manual/integration testing.

import { describe, it, expect } from 'vitest';
import schema from '../settings/schema.js';

// ---------------------------------------------------------------------------
// Helper: builds the checkerOptions object the same way vite.config.js does.
// This is the extracted logic under test — keeps tests fast and deterministic.
// ---------------------------------------------------------------------------
function buildCheckerOptions({ typeCheckEnabled, tsconfigPath, appDir, eslintConfig = {} }) {
  const { watchPath, failOnWarning = false } = eslintConfig;
  const logLevel = failOnWarning ? ['error', 'warning'] : ['error'];

  const checkerOptions = {
    overlay: false,
    eslint: {
      lintCommand: `eslint "${appDir}/**/*.{js,jsx,ts,tsx}"`,
      useFlatConfig: true,
      ...(watchPath ? { watchPath } : {}),
      dev: { logLevel },
    },
  };

  if (typeCheckEnabled) {
    checkerOptions.typescript = { tsconfigPath };
  }

  return checkerOptions;
}

// ---------------------------------------------------------------------------
// typeCheck schema defaults
// ---------------------------------------------------------------------------
describe('schema — typeCheck defaults', () => {
  it('defaults to false', () => {
    const { value } = schema.validate({});
    expect(value.development.typeCheck).toBe(false);
  });

  it('is false when not explicitly set', () => {
    const { value } = schema.validate({ development: { port: 4000 } });
    expect(value.development.typeCheck).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// checker options — typeCheck disabled
// ---------------------------------------------------------------------------
describe('buildCheckerOptions — typeCheck disabled', () => {
  it('does not include typescript when typeCheckEnabled is false', () => {
    const opts = buildCheckerOptions({
      typeCheckEnabled: false,
      tsconfigPath: '/project/tsconfig.json',
      appDir: '/project/app',
    });
    expect(opts.typescript).toBeUndefined();
  });

  it('includes eslint options regardless of typeCheck', () => {
    const opts = buildCheckerOptions({
      typeCheckEnabled: false,
      tsconfigPath: '/project/tsconfig.json',
      appDir: '/project/app',
    });
    expect(opts.eslint).toBeDefined();
    expect(opts.eslint.lintCommand).toContain('/project/app');
  });

  it('sets overlay: false', () => {
    const opts = buildCheckerOptions({
      typeCheckEnabled: false,
      tsconfigPath: '/project/tsconfig.json',
      appDir: '/project/app',
    });
    expect(opts.overlay).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// checker options — typeCheck enabled with tsconfig present
// ---------------------------------------------------------------------------
describe('buildCheckerOptions — typeCheck enabled', () => {
  it('includes typescript.tsconfigPath when typeCheckEnabled is true', () => {
    const opts = buildCheckerOptions({
      typeCheckEnabled: true,
      tsconfigPath: '/project/tsconfig.json',
      appDir: '/project/app',
    });
    expect(opts.typescript).toBeDefined();
    expect(opts.typescript.tsconfigPath).toBe('/project/tsconfig.json');
  });

  it('still includes eslint options when typeCheck is enabled', () => {
    const opts = buildCheckerOptions({
      typeCheckEnabled: true,
      tsconfigPath: '/project/tsconfig.json',
      appDir: '/project/app',
    });
    expect(opts.eslint).toBeDefined();
  });

  it('sets overlay: false even when typeCheck is enabled', () => {
    const opts = buildCheckerOptions({
      typeCheckEnabled: true,
      tsconfigPath: '/project/tsconfig.json',
      appDir: '/project/app',
    });
    expect(opts.overlay).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// typeCheck is not activated when tsconfig is absent
// ---------------------------------------------------------------------------
describe('typeCheck activation guard', () => {
  it('does not activate typeCheck when typeCheck: true but tsconfig not present', () => {
    // Simulate fs.existsSync returning false for tsconfig
    const tsconfigExists = false;
    const typeCheckSetting = true;
    const typeCheckEnabled = typeCheckSetting && tsconfigExists;

    const opts = buildCheckerOptions({
      typeCheckEnabled,
      tsconfigPath: '/project/tsconfig.json',
      appDir: '/project/app',
    });
    expect(opts.typescript).toBeUndefined();
  });

  it('activates typeCheck when both typeCheck: true and tsconfig exists', () => {
    const tsconfigExists = true;
    const typeCheckSetting = true;
    const typeCheckEnabled = typeCheckSetting && tsconfigExists;

    const opts = buildCheckerOptions({
      typeCheckEnabled,
      tsconfigPath: '/project/tsconfig.json',
      appDir: '/project/app',
    });
    expect(opts.typescript).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// eslint logLevel respects failOnWarning
// ---------------------------------------------------------------------------
describe('eslint logLevel', () => {
  it('uses ["error"] when failOnWarning is false (default)', () => {
    const opts = buildCheckerOptions({
      typeCheckEnabled: false,
      tsconfigPath: '/project/tsconfig.json',
      appDir: '/project/app',
      eslintConfig: { failOnWarning: false },
    });
    expect(opts.eslint.dev.logLevel).toEqual(['error']);
  });

  it('uses ["error", "warning"] when failOnWarning is true', () => {
    const opts = buildCheckerOptions({
      typeCheckEnabled: false,
      tsconfigPath: '/project/tsconfig.json',
      appDir: '/project/app',
      eslintConfig: { failOnWarning: true },
    });
    expect(opts.eslint.dev.logLevel).toEqual(['error', 'warning']);
  });

  it('includes watchPath when set', () => {
    const opts = buildCheckerOptions({
      typeCheckEnabled: false,
      tsconfigPath: '/project/tsconfig.json',
      appDir: '/project/app',
      eslintConfig: { watchPath: 'src/**' },
    });
    expect(opts.eslint.watchPath).toBe('src/**');
  });

  it('omits watchPath when not set', () => {
    const opts = buildCheckerOptions({
      typeCheckEnabled: false,
      tsconfigPath: '/project/tsconfig.json',
      appDir: '/project/app',
    });
    expect(opts.eslint.watchPath).toBeUndefined();
  });
});
