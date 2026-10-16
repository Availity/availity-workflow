import path from 'node:path';
import schema from '../../settings/schema.js';
import paths from '../../helpers/paths.js';
import buildWebpackCache from '../../helpers/webpack-cache.js';
import baseConfig from '../../webpack.config.js';
import prodConfig from '../../webpack.config.production.js';
import profileConfig from '../../webpack.config.profile.js';
import Settings from '../../settings/index.js';

// Minimal settings stand-in for the helper: only what buildWebpackCache reads.
const fakeSettings = (cache, { environment = 'development', workflowConfigPath } = {}) => ({
  config: () => ({ cache }),
  environment: () => environment,
  workflowConfigPath,
});

describe('cache schema', () => {
  it('defaults both modes to off', () => {
    const { error, value } = schema.validate({});
    expect(error).toBeUndefined();
    expect(value.cache.development).toBe(false);
    expect(value.cache.production).toBe(false);
    expect(value.cache.directory).toBeUndefined();
  });

  it('accepts development, production, and directory', () => {
    const { error, value } = schema.validate({
      cache: { development: true, production: true, directory: '.cache/wp' },
    });
    expect(error).toBeUndefined();
    expect(value.cache).toEqual({ development: true, production: true, directory: '.cache/wp' });
  });

  it('allows each mode to be set independently', () => {
    const { value } = schema.validate({ cache: { production: true } });
    expect(value.cache.production).toBe(true);
    expect(value.cache.development).toBe(false);
  });

  it('rejects non-boolean mode values', () => {
    const { error } = schema.validate({ cache: { development: 'yes' } });
    expect(error).toBeDefined();
  });
});

describe('buildWebpackCache', () => {
  it('returns undefined when the cache setting is missing', () => {
    expect(buildWebpackCache(fakeSettings(undefined), 'development')).toBeUndefined();
    expect(buildWebpackCache(fakeSettings(undefined), 'production')).toBeUndefined();
  });

  it('returns undefined when the requested mode is off', () => {
    const settings = fakeSettings({ development: false, production: true });
    expect(buildWebpackCache(settings, 'development')).toBeUndefined();
  });

  it('is independent per mode', () => {
    const settings = fakeSettings({ development: true, production: false });
    expect(buildWebpackCache(settings, 'development')).toBeDefined();
    expect(buildWebpackCache(settings, 'production')).toBeUndefined();
  });

  it('builds a filesystem cache at the default directory when enabled', () => {
    const cache = buildWebpackCache(fakeSettings({ development: true }), 'development');
    expect(cache.type).toBe('filesystem');
    expect(cache.cacheDirectory).toBe(path.resolve(paths.appNodeModules, '.cache/webpack'));
  });

  it('resolves a custom directory from the project root', () => {
    const cache = buildWebpackCache(fakeSettings({ production: true, directory: '.cache/wp' }), 'production');
    expect(cache.cacheDirectory).toBe(path.resolve(paths.project, '.cache/wp'));
  });

  it('keeps mode and environment caches separate via name', () => {
    const dev = buildWebpackCache(fakeSettings({ development: true }), 'development');
    const dryRun = buildWebpackCache(fakeSettings({ production: true }, { environment: 'development' }), 'production');
    const prod = buildWebpackCache(fakeSettings({ production: true }, { environment: 'production' }), 'production');
    expect(new Set([dev.name, dryRun.name, prod.name]).size).toBe(3);
  });

  it('includes the user workflow.js in buildDependencies so config edits bust the cache', () => {
    const workflowConfigPath = path.resolve(import.meta.dirname, '../../package.json');
    const cache = buildWebpackCache(fakeSettings({ development: true }, { workflowConfigPath }), 'development');
    expect(cache.buildDependencies.config).toContain(workflowConfigPath);
  });

  it('skips a workflow.js path that does not exist', () => {
    const cache = buildWebpackCache(
      fakeSettings({ development: true }, { workflowConfigPath: '/nonexistent/workflow.js' }),
      'development'
    );
    expect(cache.buildDependencies.config).not.toContain('/nonexistent/workflow.js');
  });
});

describe('webpack configs with the cache setting', () => {
  let settings;

  beforeAll(async () => {
    settings = await Settings.create();
  });

  afterEach(() => {
    settings.configuration.cache = { development: false, production: false };
  });

  it('omits the cache key by default, so webpack keeps its own default', () => {
    expect('cache' in baseConfig(settings)).toBe(false);
    expect('cache' in prodConfig(settings)).toBe(false);
    expect('cache' in profileConfig(settings)).toBe(false);
  });

  it('enables the cache for the dev config only when cache.development is on', () => {
    settings.configuration.cache = { development: true, production: false };
    expect(baseConfig(settings).cache.type).toBe('filesystem');
    expect('cache' in prodConfig(settings)).toBe(false);
  });

  it('enables the cache for production and profile only when cache.production is on', () => {
    settings.configuration.cache = { development: false, production: true };
    expect(prodConfig(settings).cache.type).toBe('filesystem');
    expect(profileConfig(settings).cache.type).toBe('filesystem');
    expect('cache' in baseConfig(settings)).toBe(false);
  });

  it('applies a custom directory to both configs', () => {
    settings.configuration.cache = { development: true, production: true, directory: '.cache/wp' };
    const expected = path.resolve(paths.project, '.cache/wp');
    expect(baseConfig(settings).cache.cacheDirectory).toBe(expected);
    expect(prodConfig(settings).cache.cacheDirectory).toBe(expected);
  });
});
