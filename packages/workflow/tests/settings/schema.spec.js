import schema from '../../settings/schema.js';

describe('settings schema', () => {
  it('validates an empty object and fills defaults', () => {
    const { error, value } = schema.validate({});

    expect(error).toBeUndefined();
    expect(value).toHaveProperty('development');
    expect(value).toHaveProperty('app');
    expect(value).toHaveProperty('globals');
    expect(value).toHaveProperty('ekko');
    expect(value).toHaveProperty('proxies');
    expect(value).toHaveProperty('experiments');
    expect(value).toHaveProperty('eslint');
  });

  it('defaults development.port to 3000', () => {
    const { value } = schema.validate({});
    expect(value.development.port).toBe(3000);
  });

  it('defaults development.host to 0.0.0.0', () => {
    const { value } = schema.validate({});
    expect(value.development.host).toBe('0.0.0.0');
  });

  it('defaults app.title to Availity', () => {
    const { value } = schema.validate({});
    expect(value.app.title).toBe('Availity');
  });

  it('defaults globals to an empty object (runtime flags like __DEV__ are set by settings.globals())', () => {
    const { value } = schema.validate({});
    expect(value.globals).toEqual({});
  });

  it('rejects port below 1024', () => {
    const { error } = schema.validate({ development: { port: 100 } });
    expect(error).toBeDefined();
    expect(error.details[0].path).toEqual(['development', 'port']);
  });

  it('rejects port above 65535', () => {
    const { error } = schema.validate({ development: { port: 70_000 } });
    expect(error).toBeDefined();
    expect(error.details[0].path).toEqual(['development', 'port']);
  });

  it('accepts a valid complete config', () => {
    const input = {
      development: {
        open: '/dashboard',
        notification: false,
        host: '0.0.0.0',
        port: 8080,
        sourceMap: 'cheap-module-source-map',
        hotLoader: false,
        babelInclude: ['react-loadable'],
        jestOverrides: { collectCoverage: true },
      },
      app: { title: 'My App' },
      testing: { browsers: ['Firefox', 'Chrome'] },
      globals: { __DEV__: true, __TEST__: false, __PROD__: false, __STAGING__: false },
      ekko: { enabled: false, port: 9999, latency: 100 },
      proxies: [
        {
          context: ['/api'],
          target: 'http://localhost:9999',
          enabled: true,
          logLevel: 'debug',
        },
      ],
      experiments: { lazyCompilation: true },
      eslint: { failOnError: false },
      modifyViteConfig: (config) => config,
    };

    const { error, value } = schema.validate(input);
    expect(error).toBeUndefined();
    expect(value.development.port).toBe(8080);
    expect(value.app.title).toBe('My App');
    expect(typeof value.modifyViteConfig).toBe('function');
  });

  it('allows unknown keys at the top level', () => {
    const { error, value } = schema.validate({ customKey: 'customValue' });
    expect(error).toBeUndefined();
    expect(value.customKey).toBe('customValue');
  });

  it('accepts development.open as false', () => {
    const { error, value } = schema.validate({ development: { open: false } });
    expect(error).toBeUndefined();
    expect(value.development.open).toBe(false);
  });

  it('accepts development.resolveConditions as a string array', () => {
    const { error, value } = schema.validate({ development: { resolveConditions: ['browser', 'import', 'default'] } });
    expect(error).toBeUndefined();
    expect(value.development.resolveConditions).toEqual(['browser', 'import', 'default']);
  });

  it('does not set development.resolveConditions by default (optional)', () => {
    const { value } = schema.validate({});
    expect(value.development.resolveConditions).toBeUndefined();
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

  it('does not set eslint.maxWarnings by default (optional)', () => {
    const { value } = schema.validate({});
    expect(value.eslint.maxWarnings).toBeUndefined();
  });

  it('defaults experiments to an empty object', () => {
    const { value } = schema.validate({});
    expect(value.experiments).toEqual({});
  });

  it('preserves other development defaults when a single field is overridden', () => {
    const { value } = schema.validate({ development: { port: 8080 } });
    expect(value.development.host).toBe('0.0.0.0');
    expect(value.development.notification).toBe(true);
    expect(value.development.hotLoader).toBe(true);
    expect(value.development.sourceMap).toBe('source-map');
  });

  it('preserves other eslint defaults when a single field is overridden', () => {
    const { value } = schema.validate({ eslint: { failOnWarning: true } });
    expect(value.eslint.failOnError).toBe(true);
    expect(value.eslint.fix).toBe(false);
    expect(value.eslint.quiet).toBe(false);
  });
});
