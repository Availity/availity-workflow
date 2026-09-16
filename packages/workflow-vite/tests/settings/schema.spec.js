import schema from '../../settings/schema.js';

describe('settings schema — defaults', () => {
  let value;

  beforeEach(() => {
    ({ value } = schema.validate({}));
  });

  it('validates an empty object without errors', () => {
    const { error } = schema.validate({});
    expect(error).toBeUndefined();
  });

  it('produces all top-level sections', () => {
    expect(value).toHaveProperty('development');
    expect(value).toHaveProperty('app');
    expect(value).toHaveProperty('globals');
    expect(value).toHaveProperty('ekko');
    expect(value).toHaveProperty('proxies');
    expect(value).toHaveProperty('eslint');
  });

  // development defaults
  it('defaults development.host to localhost', () => {
    expect(value.development.host).toBe('localhost');
  });

  it('defaults development.port to 3000', () => {
    expect(value.development.port).toBe(3000);
  });

  it("defaults development.open to '/'", () => {
    expect(value.development.open).toBe('/');
  });

  it('defaults development.notification to true', () => {
    expect(value.development.notification).toBe(true);
  });

  it('defaults development.sourceMap to true', () => {
    expect(value.development.sourceMap).toBe(true);
  });

  it('defaults development.suppressDeprecationWarnings to false', () => {
    expect(value.development.suppressDeprecationWarnings).toBe(false);
  });

  it('defaults development.babelInclude to empty array', () => {
    expect(value.development.babelInclude).toEqual([]);
  });

  it('defaults development.jestOverrides to empty object', () => {
    expect(value.development.jestOverrides).toEqual({});
  });

  it('defaults development.vitestOverrides to empty object', () => {
    expect(value.development.vitestOverrides).toEqual({});
  });

  it('does not set development.resolveConditions by default (optional)', () => {
    expect(value.development.resolveConditions).toBeUndefined();
  });

  // app defaults
  it('defaults app.title to Availity', () => {
    expect(value.app.title).toBe('Availity');
  });

  // globals defaults
  it('defaults globals to an empty object (built-ins are computed at runtime)', () => {
    expect(value.globals).toEqual({});
  });

  // ekko defaults
  it('defaults ekko.enabled to true', () => {
    expect(value.ekko.enabled).toBe(true);
  });

  it('defaults ekko.port to 9999', () => {
    expect(value.ekko.port).toBe(9999);
  });

  it('defaults ekko.latency to 250', () => {
    expect(value.ekko.latency).toBe(250);
  });

  it('defaults ekko.plugins to @availity/mock-data', () => {
    expect(value.ekko.plugins).toEqual(['@availity/mock-data']);
  });

  it('does not set ekko.pluginContext by default (computed from resolved port at runtime)', () => {
    expect(value.ekko.pluginContext).toBeUndefined();
  });

  // proxies default
  it('defaults proxies to a single entry targeting the ekko port', () => {
    expect(value.proxies).toHaveLength(1);
    expect(value.proxies[0].context).toEqual(['/api/', '/ms', '/cloud']);
    expect(value.proxies[0].enabled).toBe(true);
    expect(value.proxies[0].headers).toHaveProperty('RemoteUser');
  });

  // eslint defaults
  it('defaults eslint.failOnError to true', () => {
    expect(value.eslint.failOnError).toBe(true);
  });

  it('defaults eslint.failOnWarning to false', () => {
    expect(value.eslint.failOnWarning).toBe(false);
  });

  it('defaults eslint.fix to false', () => {
    expect(value.eslint.fix).toBe(false);
  });

  it('defaults eslint.quiet to false', () => {
    expect(value.eslint.quiet).toBe(false);
  });

  it('does not set eslint.maxWarnings by default (optional)', () => {
    expect(value.eslint.maxWarnings).toBeUndefined();
  });

  it('does not set eslint.watchPath by default (optional)', () => {
    expect(value.eslint.watchPath).toBeUndefined();
  });

  // typeCheck default
  it('defaults development.typeCheck to false', () => {
    expect(value.development.typeCheck).toBe(false);
  });

  // optimizeDeps default
  it('defaults development.optimizeDeps to an empty array', () => {
    expect(value.development.optimizeDeps).toEqual([]);
  });
});

const passthroughConfig = (config) => config;

describe('settings schema — validation', () => {
  it('rejects port below 1024', () => {
    const { error } = schema.validate({ development: { port: 80 } });
    expect(error).toBeDefined();
    expect(error.details[0].path).toEqual(['development', 'port']);
  });

  it('rejects port above 65535', () => {
    const { error } = schema.validate({ development: { port: 99_999 } });
    expect(error).toBeDefined();
  });

  it('accepts development.open as a path string', () => {
    const { error, value } = schema.validate({ development: { open: '/dashboard' } });
    expect(error).toBeUndefined();
    expect(value.development.open).toBe('/dashboard');
  });

  it('accepts development.open as false', () => {
    const { error, value } = schema.validate({ development: { open: false } });
    expect(error).toBeUndefined();
    expect(value.development.open).toBe(false);
  });

  it('accepts resolveConditions as a string array', () => {
    const { error, value } = schema.validate({
      development: { resolveConditions: ['browser', 'import', 'default'] },
    });
    expect(error).toBeUndefined();
    expect(value.development.resolveConditions).toEqual(['browser', 'import', 'default']);
  });

  it('accepts eslint.maxWarnings as 0', () => {
    const { error, value } = schema.validate({ eslint: { maxWarnings: 0 } });
    expect(error).toBeUndefined();
    expect(value.eslint.maxWarnings).toBe(0);
  });

  it('rejects eslint.maxWarnings below 0', () => {
    const { error } = schema.validate({ eslint: { maxWarnings: -1 } });
    expect(error).toBeDefined();
  });

  it('accepts eslint.watchPath as a string', () => {
    const { error, value } = schema.validate({ eslint: { watchPath: 'src/**' } });
    expect(error).toBeUndefined();
    expect(value.eslint.watchPath).toBe('src/**');
  });

  it('accepts eslint.watchPath as an array of strings', () => {
    const { error, value } = schema.validate({ eslint: { watchPath: ['src/**', 'lib/**'] } });
    expect(error).toBeUndefined();
    expect(value.eslint.watchPath).toEqual(['src/**', 'lib/**']);
  });

  it('accepts proxy context as a string', () => {
    const { error, value } = schema.validate({
      proxies: [{ context: '/api', target: 'http://localhost:9999' }],
    });
    expect(error).toBeUndefined();
    expect(value.proxies[0].context).toBe('/api');
  });

  it('accepts proxy context as an array of strings', () => {
    const { error, value } = schema.validate({
      proxies: [{ context: ['/api', '/ms'], target: 'http://localhost:9999' }],
    });
    expect(error).toBeUndefined();
    expect(value.proxies[0].context).toEqual(['/api', '/ms']);
  });

  it('accepts modifyViteConfig as a function', () => {
    const { error, value } = schema.validate({ modifyViteConfig: passthroughConfig });
    expect(error).toBeUndefined();
    expect(typeof value.modifyViteConfig).toBe('function');
  });

  it('allows unknown top-level keys', () => {
    const { error, value } = schema.validate({ customField: 'custom' });
    expect(error).toBeUndefined();
    expect(value.customField).toBe('custom');
  });
});

describe('settings schema — partial ekko overrides preserve defaults', () => {
  it('preserves ekko.enabled when only latency is overridden', () => {
    const { value } = schema.validate({ ekko: { latency: 500 } });
    expect(value.ekko.enabled).toBe(true);
    expect(value.ekko.latency).toBe(500);
    expect(value.ekko.port).toBe(9999);
    expect(value.ekko.plugins).toEqual(['@availity/mock-data']);
  });

  it('preserves ekko.plugins when only port is overridden', () => {
    const { value } = schema.validate({ ekko: { port: 8888 } });
    expect(value.ekko.plugins).toEqual(['@availity/mock-data']);
    expect(value.ekko.port).toBe(8888);
  });

  it('preserves ekko.latency when enabled is set to false', () => {
    const { value } = schema.validate({ ekko: { enabled: false } });
    expect(value.ekko.latency).toBe(250);
    expect(value.ekko.enabled).toBe(false);
  });
});

describe('settings schema — partial eslint overrides preserve defaults', () => {
  it('preserves failOnError default when only failOnWarning is set', () => {
    const { value } = schema.validate({ eslint: { failOnWarning: true } });
    expect(value.eslint.failOnError).toBe(true);
    expect(value.eslint.failOnWarning).toBe(true);
  });

  it('preserves fix and quiet defaults when only failOnError is set', () => {
    const { value } = schema.validate({ eslint: { failOnError: false } });
    expect(value.eslint.fix).toBe(false);
    expect(value.eslint.quiet).toBe(false);
  });
});

describe('settings schema — typeCheck', () => {
  it('accepts development.typeCheck: true', () => {
    const { error, value } = schema.validate({ development: { typeCheck: true } });
    expect(error).toBeUndefined();
    expect(value.development.typeCheck).toBe(true);
  });

  it('accepts development.typeCheck: false explicitly', () => {
    const { error, value } = schema.validate({ development: { typeCheck: false } });
    expect(error).toBeUndefined();
    expect(value.development.typeCheck).toBe(false);
  });

  it('rejects non-boolean values for typeCheck', () => {
    const { error } = schema.validate({ development: { typeCheck: 'yes' } });
    expect(error).toBeDefined();
    expect(error.details[0].path).toEqual(['development', 'typeCheck']);
  });

  it('preserves other development defaults when typeCheck is set', () => {
    const { value } = schema.validate({ development: { typeCheck: true } });
    expect(value.development.port).toBe(3000);
    expect(value.development.host).toBe('localhost');
    expect(value.development.notification).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// development.optimizeDeps
// ---------------------------------------------------------------------------
describe('settings schema — optimizeDeps', () => {
  it('accepts an array of package names', () => {
    const { error, value } = schema.validate({ development: { optimizeDeps: ['dayjs', '@availity/spaces'] } });
    expect(error).toBeUndefined();
    expect(value.development.optimizeDeps).toEqual(['dayjs', '@availity/spaces']);
  });

  it('accepts an empty array', () => {
    const { error, value } = schema.validate({ development: { optimizeDeps: [] } });
    expect(error).toBeUndefined();
    expect(value.development.optimizeDeps).toEqual([]);
  });

  it('rejects non-string array items', () => {
    const { error } = schema.validate({ development: { optimizeDeps: [42] } });
    expect(error).toBeDefined();
    expect(error.details[0].path).toEqual(['development', 'optimizeDeps', 0]);
  });

  it('preserves other development defaults when optimizeDeps is set', () => {
    const { value } = schema.validate({ development: { optimizeDeps: ['dayjs'] } });
    expect(value.development.port).toBe(3000);
    expect(value.development.sourceMap).toBe(true);
  });
});
