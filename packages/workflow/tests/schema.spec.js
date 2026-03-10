import schema from '../settings/schema.js';

describe('settings schema', () => {
  it('validates an empty object and fills defaults', () => {
    const { error, value } = schema.validate({});

    expect(error).toBeUndefined();
    expect(value).toHaveProperty('development');
    expect(value).toHaveProperty('app');
    expect(value).toHaveProperty('testing');
    expect(value).toHaveProperty('globals');
    expect(value).toHaveProperty('ekko');
    expect(value).toHaveProperty('proxies');
    expect(value).toHaveProperty('experiments');
    expect(value).toHaveProperty('eslint');
    expect(value).toHaveProperty('bundler');
    expect(value).toHaveProperty('testRunner');
  });

  it('defaults development.port to 3000', () => {
    const { value } = schema.validate({});
    expect(value.development.port).toBe(3000);
  });

  it('defaults development.host to localhost', () => {
    const { value } = schema.validate({});
    expect(value.development.host).toBe('localhost');
  });

  it('defaults bundler to webpack', () => {
    const { value } = schema.validate({});
    expect(value.bundler).toBe('webpack');
  });

  it('defaults testRunner to jest', () => {
    const { value } = schema.validate({});
    expect(value.testRunner).toBe('jest');
  });

  it('defaults app.title to Availity', () => {
    const { value } = schema.validate({});
    expect(value.app.title).toBe('Availity');
  });

  it('defaults globals to include __DEV__, __TEST__, __PROD__, __STAGING__', () => {
    const { value } = schema.validate({});
    expect(value.globals).toEqual({
      __DEV__: false,
      __TEST__: false,
      __PROD__: false,
      __STAGING__: false,
    });
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

  it('rejects invalid bundler value', () => {
    const { error } = schema.validate({ bundler: 'rollup' });
    expect(error).toBeDefined();
    expect(error.details[0].path).toEqual(['bundler']);
  });

  it('rejects invalid testRunner value', () => {
    const { error } = schema.validate({ testRunner: 'mocha' });
    expect(error).toBeDefined();
    expect(error.details[0].path).toEqual(['testRunner']);
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
      bundler: 'vite',
      testRunner: 'vitest',
      modifyViteConfig: (config) => config,
    };

    const { error, value } = schema.validate(input);
    expect(error).toBeUndefined();
    expect(value.development.port).toBe(8080);
    expect(value.app.title).toBe('My App');
    expect(value.bundler).toBe('vite');
    expect(value.testRunner).toBe('vitest');
    expect(typeof value.modifyViteConfig).toBe('function');
  });

  it('allows unknown keys at the top level', () => {
    const { error, value } = schema.validate({ customKey: 'customValue' });
    expect(error).toBeUndefined();
    expect(value.customKey).toBe('customValue');
  });
});
