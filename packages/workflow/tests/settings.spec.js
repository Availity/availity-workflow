import path from 'path';
import settings from '../settings/index.js';
import paths from '../helpers/paths.js';

// Save original values for restoration
const originalNodeEnv = process.env.NODE_ENV;
const originalArgv = process.argv;

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
  process.argv = originalArgv;
  settings.configuration = null;
  settings.shouldMimicStaging = undefined;
  settings.devServerPort = null;
  settings.ekkoServerPort = null;
});

// ---------------------------------------------------------------------------
// environment()
// ---------------------------------------------------------------------------
describe('environment()', () => {
  it('returns NODE_ENV when set', () => {
    process.env.NODE_ENV = 'production';
    expect(settings.environment()).toBe('production');
  });

  it('defaults to development when NODE_ENV is empty', () => {
    delete process.env.NODE_ENV;
    expect(settings.environment()).toBe('development');
  });

  it('sets NODE_ENV to development as a side effect when unset', () => {
    delete process.env.NODE_ENV;
    settings.environment();
    expect(process.env.NODE_ENV).toBe('development');
  });
});

// ---------------------------------------------------------------------------
// Boolean environment checks
// ---------------------------------------------------------------------------
describe('isProduction()', () => {
  it('returns true when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';
    process.argv = ['node', 'script'];
    expect(settings.isProduction()).toBe(true);
  });

  it('returns true when --production flag is passed', () => {
    process.env.NODE_ENV = 'development';
    process.argv = ['node', 'script', '--production'];
    expect(settings.isProduction()).toBeTruthy();
  });

  it('returns false in development', () => {
    process.env.NODE_ENV = 'development';
    process.argv = ['node', 'script'];
    expect(settings.isProduction()).toBeFalsy();
  });
});

describe('isDevelopment()', () => {
  it('returns true when NODE_ENV is development', () => {
    process.env.NODE_ENV = 'development';
    expect(settings.isDevelopment()).toBe(true);
  });

  it('returns false when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';
    expect(settings.isDevelopment()).toBe(false);
  });
});

describe('isTesting()', () => {
  it('returns true when NODE_ENV is test', () => {
    process.env.NODE_ENV = 'test';
    expect(settings.isTesting()).toBe(true);
  });

  it('returns false when NODE_ENV is development', () => {
    process.env.NODE_ENV = 'development';
    expect(settings.isTesting()).toBe(false);
  });
});

describe('isStaging()', () => {
  it('returns true when NODE_ENV is staging', () => {
    process.env.NODE_ENV = 'staging';
    expect(settings.isStaging()).toBe(true);
  });

  it('returns true when shouldMimicStaging is set', () => {
    process.env.NODE_ENV = 'development';
    settings.shouldMimicStaging = true;
    expect(settings.isStaging()).toBe(true);
  });

  it('returns false when NODE_ENV is development and shouldMimicStaging is falsy', () => {
    process.env.NODE_ENV = 'development';
    settings.shouldMimicStaging = false;
    expect(settings.isStaging()).toBe(false);
  });
});

describe('isDistribution()', () => {
  it('returns true in production', () => {
    process.env.NODE_ENV = 'production';
    process.argv = ['node', 'script'];
    expect(settings.isDistribution()).toBe(true);
  });

  it('returns true in staging', () => {
    process.env.NODE_ENV = 'staging';
    process.argv = ['node', 'script'];
    expect(settings.isDistribution()).toBe(true);
  });

  it('returns false in development', () => {
    process.env.NODE_ENV = 'development';
    process.argv = ['node', 'script'];
    expect(settings.isDistribution()).toBeFalsy();
  });
});

// ---------------------------------------------------------------------------
// sourceMap()
// ---------------------------------------------------------------------------
describe('sourceMap()', () => {
  beforeEach(() => {
    settings.configuration = { development: { sourceMap: 'cheap-module-source-map' } };
    process.argv = ['node', 'script'];
  });

  it('returns source-map for distribution builds', () => {
    process.env.NODE_ENV = 'production';
    expect(settings.sourceMap()).toBe('source-map');
  });

  it('returns source-map when staging', () => {
    process.env.NODE_ENV = 'staging';
    expect(settings.sourceMap()).toBe('source-map');
  });

  it('returns source-map for dry runs', () => {
    process.env.NODE_ENV = 'development';
    process.argv = ['node', 'script', '--dryRun'];
    expect(settings.sourceMap()).toBe('source-map');
  });

  it('returns config value in development', () => {
    process.env.NODE_ENV = 'development';
    expect(settings.sourceMap()).toBe('cheap-module-source-map');
  });

  it('defaults to cheap-module-source-map when not configured', () => {
    process.env.NODE_ENV = 'development';
    settings.configuration = { development: {} };
    expect(settings.sourceMap()).toBe('cheap-module-source-map');
  });
});

// ---------------------------------------------------------------------------
// css()
// ---------------------------------------------------------------------------
describe('css()', () => {
  it('returns hashed filename in production', () => {
    process.env.NODE_ENV = 'production';
    process.argv = ['node', 'script'];
    expect(settings.css()).toBe('[name]-[contenthash:8].chunk.css');
  });

  it('returns simple filename in development', () => {
    process.env.NODE_ENV = 'development';
    process.argv = ['node', 'script'];
    expect(settings.css()).toBe('[name].chunk.css');
  });
});

// ---------------------------------------------------------------------------
// fileName()
// ---------------------------------------------------------------------------
describe('fileName()', () => {
  it('returns hashed chunk filename in production', () => {
    process.env.NODE_ENV = 'production';
    process.argv = ['node', 'script'];
    expect(settings.fileName()).toBe('[name]-[contenthash:8].chunk.js');
  });

  it('returns simple filename in development', () => {
    process.env.NODE_ENV = 'development';
    process.argv = ['node', 'script'];
    expect(settings.fileName()).toBe('[name].js');
  });
});

// ---------------------------------------------------------------------------
// chunkFileName()
// ---------------------------------------------------------------------------
describe('chunkFileName()', () => {
  it('returns hashed chunk filename in production', () => {
    process.env.NODE_ENV = 'production';
    process.argv = ['node', 'script'];
    expect(settings.chunkFileName()).toBe('[name]-[contenthash:8].chunk.js');
  });

  it('returns simple chunk filename in development', () => {
    process.env.NODE_ENV = 'development';
    process.argv = ['node', 'script'];
    expect(settings.chunkFileName()).toBe('[name].chunk.js');
  });
});

// ---------------------------------------------------------------------------
// output()
// ---------------------------------------------------------------------------
describe('output()', () => {
  it('returns dist path for distribution builds', () => {
    process.env.NODE_ENV = 'production';
    process.argv = ['node', 'script'];
    expect(settings.output()).toBe(path.join(paths.project, 'dist'));
  });

  it('returns build path for non-distribution builds', () => {
    process.env.NODE_ENV = 'development';
    process.argv = ['node', 'script'];
    expect(settings.output()).toBe(path.join(paths.project, 'build'));
  });
});

// ---------------------------------------------------------------------------
// host()
// ---------------------------------------------------------------------------
describe('host()', () => {
  it('returns configured host', () => {
    settings.configuration = { development: { host: '127.0.0.1' } };
    expect(settings.host()).toBe('127.0.0.1');
  });

  it('defaults to 0.0.0.0 when not configured', () => {
    settings.configuration = { development: {} };
    expect(settings.host()).toBe('0.0.0.0');
  });

  it('defaults to 0.0.0.0 when development is empty', () => {
    settings.configuration = {};
    expect(settings.host()).toBe('0.0.0.0');
  });
});

// ---------------------------------------------------------------------------
// title()
// ---------------------------------------------------------------------------
describe('title()', () => {
  it('returns configured title', () => {
    settings.configuration = { app: { title: 'My App' } };
    expect(settings.title()).toBe('My App');
  });

  it('defaults to Availity when not configured', () => {
    settings.configuration = { app: {} };
    expect(settings.title()).toBe('Availity');
  });

  it('defaults to Availity when app is absent', () => {
    settings.configuration = {};
    expect(settings.title()).toBe('Availity');
  });
});

// ---------------------------------------------------------------------------
// port() / ekkoPort()
// ---------------------------------------------------------------------------
describe('port()', () => {
  it('returns devServerPort', () => {
    settings.devServerPort = 3000;
    expect(settings.port()).toBe(3000);
  });

  it('returns null when not set', () => {
    expect(settings.port()).toBeNull();
  });
});

describe('ekkoPort()', () => {
  it('returns ekkoServerPort', () => {
    settings.ekkoServerPort = 9999;
    expect(settings.ekkoPort()).toBe(9999);
  });
});

// ---------------------------------------------------------------------------
// open()
// ---------------------------------------------------------------------------
describe('open()', () => {
  it('returns the configured open path', () => {
    settings.configuration = { development: { open: '/dashboard' } };
    expect(settings.open()).toBe('/dashboard');
  });

  it('returns undefined when not configured', () => {
    settings.configuration = { development: {} };
    expect(settings.open()).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// globals()
// ---------------------------------------------------------------------------
describe('globals()', () => {
  it('includes environment flag globals', () => {
    process.env.NODE_ENV = 'development';
    settings.configuration = { globals: {} };
    const result = settings.globals();

    expect(result['process.env.NODE_ENV']).toBe('"development"');
    expect(result.__DEV__).toBe(true);
    expect(result.__TEST__).toBe(false);
    expect(result.__PROD__).toBe(false);
    expect(result.__STAGING__).toBe(false);
  });

  it('sets __TEST__ to true when NODE_ENV is test', () => {
    process.env.NODE_ENV = 'test';
    settings.configuration = { globals: {} };
    const result = settings.globals();

    expect(result.__TEST__).toBe(true);
    expect(result.__DEV__).toBe(false);
  });

  it('sets __PROD__ to true when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';
    settings.configuration = { globals: {} };
    const result = settings.globals();

    expect(result.__PROD__).toBe(true);
    expect(result['process.env.NODE_ENV']).toBe('"production"');
  });

  it('maps staging to production for process.env.NODE_ENV', () => {
    process.env.NODE_ENV = 'staging';
    settings.configuration = { globals: {} };
    const result = settings.globals();

    expect(result['process.env.NODE_ENV']).toBe('"production"');
    expect(result.__STAGING__).toBe(true);
  });

  it('stringifies config globals that are plain strings', () => {
    process.env.NODE_ENV = 'development';
    settings.configuration = {
      globals: { MY_VAR: 'hello' }
    };
    const result = settings.globals();

    expect(result.MY_VAR).toBe('"hello"');
  });

  it('preserves config globals that are already valid JSON', () => {
    process.env.NODE_ENV = 'development';
    settings.configuration = {
      globals: { MY_VAR: '"already-quoted"' }
    };
    const result = settings.globals();

    expect(result.MY_VAR).toBe('"already-quoted"');
  });

  it('overrides config globals with matching process.env values', () => {
    process.env.NODE_ENV = 'development';
    process.env.MY_VAR = 'from-env';
    settings.configuration = {
      globals: { MY_VAR: 'from-config' }
    };

    try {
      const result = settings.globals();
      expect(result.MY_VAR).toBe('"from-env"');
    } finally {
      delete process.env.MY_VAR;
    }
  });

  it('does not include process.env keys not declared in config globals', () => {
    process.env.NODE_ENV = 'development';
    process.env.SECRET_KEY = 'secret';
    settings.configuration = { globals: {} };

    try {
      const result = settings.globals();
      expect(result.SECRET_KEY).toBeUndefined();
    } finally {
      delete process.env.SECRET_KEY;
    }
  });

  it('defaults globals to empty object when not configured', () => {
    process.env.NODE_ENV = 'development';
    settings.configuration = {};
    const result = settings.globals();

    expect(result).toHaveProperty(['process.env.NODE_ENV']);
    expect(result.__DEV__).toBe(true);
  });

  it('recurses into nested objects in globals', () => {
    process.env.NODE_ENV = 'development';
    settings.configuration = {
      globals: { nested: { key: 'value' } }
    };
    const result = settings.globals();

    expect(result.nested.key).toBe('"value"');
  });

  it('skips functions in globals', () => {
    process.env.NODE_ENV = 'development';
    const fn = () => {};
    settings.configuration = {
      globals: { myFn: fn }
    };
    const result = settings.globals();

    expect(result.myFn).toBe(fn);
  });
});

// ---------------------------------------------------------------------------
// project() / app()
// ---------------------------------------------------------------------------
describe('project()', () => {
  it('returns paths.project', () => {
    expect(settings.project()).toBe(paths.project);
  });
});

describe('app()', () => {
  it('returns paths.app', () => {
    expect(settings.app()).toBe(paths.app);
  });
});

// ---------------------------------------------------------------------------
// asset()
// ---------------------------------------------------------------------------
describe('asset()', () => {
  it('returns path relative to app() when project file exists', () => {
    process.env.NODE_ENV = 'test';
    const projectFile = path.join(paths.project, 'package.json');
    const workflowFile = '/some/workflow/file.js';

    // package.json exists at project root, so projectFile should be chosen
    const result = settings.asset(workflowFile, projectFile);
    expect(result).toBe(path.relative(paths.app, projectFile));
  });

  it('returns path relative to app() for workflow file when project file does not exist', () => {
    process.env.NODE_ENV = 'test';
    const workflowFile = path.join(paths.project, 'package.json');
    const projectFile = '/does/not/exist/file.js';

    const result = settings.asset(workflowFile, projectFile);
    expect(result).toBe(path.relative(paths.app, workflowFile));
  });
});

// ---------------------------------------------------------------------------
// bundler() / testRunner() / isVite() / isWebpack()
// ---------------------------------------------------------------------------
describe('bundler()', () => {
  it('returns configured bundler', () => {
    settings.configuration = { bundler: 'vite' };
    expect(settings.bundler()).toBe('vite');
  });

  it('defaults to webpack', () => {
    settings.configuration = {};
    expect(settings.bundler()).toBe('webpack');
  });
});

describe('testRunner()', () => {
  it('returns configured testRunner', () => {
    settings.configuration = { testRunner: 'vitest' };
    expect(settings.testRunner()).toBe('vitest');
  });

  it('defaults to jest', () => {
    settings.configuration = {};
    expect(settings.testRunner()).toBe('jest');
  });
});

describe('isVite()', () => {
  it('returns true when bundler is vite', () => {
    settings.configuration = { bundler: 'vite' };
    expect(settings.isVite()).toBe(true);
  });

  it('returns false when bundler is webpack', () => {
    settings.configuration = { bundler: 'webpack' };
    expect(settings.isVite()).toBe(false);
  });
});

describe('isWebpack()', () => {
  it('returns true when bundler is webpack', () => {
    settings.configuration = { bundler: 'webpack' };
    expect(settings.isWebpack()).toBe(true);
  });

  it('returns false when bundler is vite', () => {
    settings.configuration = { bundler: 'vite' };
    expect(settings.isWebpack()).toBe(false);
  });

  it('returns true by default (no bundler set)', () => {
    settings.configuration = {};
    expect(settings.isWebpack()).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// enableHotLoader()
// ---------------------------------------------------------------------------
describe('enableHotLoader()', () => {
  it('returns true by default', () => {
    settings.configuration = { development: {} };
    expect(settings.enableHotLoader()).toBe(true);
  });

  it('returns false when explicitly disabled', () => {
    settings.configuration = { development: { hotLoader: false } };
    expect(settings.enableHotLoader()).toBe(false);
  });

  it('returns true when explicitly enabled', () => {
    settings.configuration = { development: { hotLoader: true } };
    expect(settings.enableHotLoader()).toBe(true);
  });

  it('returns enabled property when hotLoader is an object', () => {
    settings.configuration = { development: { hotLoader: { enabled: true } } };
    expect(settings.enableHotLoader()).toBe(true);
  });

  it('returns false when hotLoader is an object without enabled', () => {
    settings.configuration = { development: { hotLoader: { other: 'option' } } };
    expect(settings.enableHotLoader()).toBe(false);
  });

  it('returns false when hotLoader object has enabled: false', () => {
    settings.configuration = { development: { hotLoader: { enabled: false } } };
    expect(settings.enableHotLoader()).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isEkko()
// ---------------------------------------------------------------------------
describe('isEkko()', () => {
  it('returns true by default', () => {
    settings.configuration = { ekko: {} };
    expect(settings.isEkko()).toBe(true);
  });

  it('returns false when disabled', () => {
    settings.configuration = { ekko: { enabled: false } };
    expect(settings.isEkko()).toBe(false);
  });

  it('returns true when explicitly enabled', () => {
    settings.configuration = { ekko: { enabled: true } };
    expect(settings.isEkko()).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// eslint()
// ---------------------------------------------------------------------------
describe('eslint()', () => {
  it('returns the eslint config from configuration', () => {
    const eslintConfig = { failOnError: true };
    settings.configuration = { eslint: eslintConfig };
    expect(settings.eslint()).toBe(eslintConfig);
  });
});

// ---------------------------------------------------------------------------
// include()
// ---------------------------------------------------------------------------
describe('include()', () => {
  it('returns an array with the app path and a regex', () => {
    settings.configuration = { development: { babelInclude: [] } };
    const result = settings.include();

    expect(result).toHaveLength(2);
    expect(result[0]).toBe(paths.app);
    expect(result[1]).toBeInstanceOf(RegExp);
  });

  it('regex includes @av by default', () => {
    settings.configuration = { development: { babelInclude: [] } };
    const result = settings.include();
    const regex = result[1];

    expect(regex.test('node_modules/@av/some-package/index.js')).toBe(true);
  });

  it('regex includes user-specified packages', () => {
    settings.configuration = { development: { babelInclude: ['react-loadable'] } };
    const result = settings.include();
    const regex = result[1];

    expect(regex.test('node_modules/react-loadable/index.js')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// coverage()
// ---------------------------------------------------------------------------
describe('coverage()', () => {
  it('returns configured coverage path', () => {
    settings.configuration = { development: { coverage: '/custom/coverage' } };
    expect(settings.coverage()).toBe('/custom/coverage');
  });

  it('defaults to project/coverage', () => {
    settings.configuration = { development: {} };
    expect(settings.coverage()).toBe(path.join(paths.project, 'coverage'));
  });
});

// ---------------------------------------------------------------------------
// isNotifications()
// ---------------------------------------------------------------------------
describe('isNotifications()', () => {
  it('returns true by default', () => {
    settings.configuration = { development: {} };
    expect(settings.isNotifications()).toBe(true);
  });

  it('returns false when disabled', () => {
    settings.configuration = { development: { notification: false } };
    expect(settings.isNotifications()).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// historyFallback()
// ---------------------------------------------------------------------------
describe('historyFallback()', () => {
  it('returns true by default', () => {
    settings.configuration = { development: {} };
    expect(settings.historyFallback()).toBe(true);
  });

  it('returns configured value', () => {
    settings.configuration = { development: { historyFallback: false } };
    expect(settings.historyFallback()).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isDryRun() and other argv-dependent booleans
// ---------------------------------------------------------------------------
describe('isDryRun()', () => {
  it('returns true when --dryRun flag is passed', () => {
    process.argv = ['node', 'script', '--dryRun'];
    expect(settings.isDryRun()).toBe(true);
  });

  it('returns false without the flag', () => {
    process.argv = ['node', 'script'];
    expect(settings.isDryRun()).toBe(false);
  });
});

describe('isIntegration()', () => {
  it('returns true when NODE_ENV is integration', () => {
    process.env.NODE_ENV = 'integration';
    expect(settings.isIntegration()).toBe(true);
  });

  it('returns false otherwise', () => {
    process.env.NODE_ENV = 'development';
    expect(settings.isIntegration()).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// config()
// ---------------------------------------------------------------------------
describe('config()', () => {
  it('returns the configuration object', () => {
    const cfg = { development: {}, app: {} };
    settings.configuration = cfg;
    expect(settings.config()).toBe(cfg);
  });
});

// ---------------------------------------------------------------------------
// experimentalWebpackFeatures()
// ---------------------------------------------------------------------------
describe('experimentalWebpackFeatures()', () => {
  it('returns configured experiments', () => {
    settings.configuration = { experiments: { lazyCompilation: true } };
    expect(settings.experimentalWebpackFeatures()).toEqual({ lazyCompilation: true });
  });

  it('defaults to empty object', () => {
    settings.configuration = {};
    expect(settings.experimentalWebpackFeatures()).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// getHotLoaderName() / getHotLoaderEntry()
// ---------------------------------------------------------------------------
describe('getHotLoaderName()', () => {
  it('returns react-refresh/babel', () => {
    expect(settings.getHotLoaderName()).toBe('react-refresh/babel');
  });
});

describe('getHotLoaderEntry()', () => {
  it('returns configured hotLoaderEntry', () => {
    const regex = /\/Main\.tsx?/;
    settings.configuration = { development: { hotLoaderEntry: regex } };
    expect(settings.getHotLoaderEntry()).toBe(regex);
  });

  it('defaults to /App.jsx? regex', () => {
    settings.configuration = { development: {} };
    const result = settings.getHotLoaderEntry();
    expect(result).toBeInstanceOf(RegExp);
    expect(result.test('/App.js')).toBe(true);
    expect(result.test('/App.jsx')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// browsers()
// ---------------------------------------------------------------------------
describe('browsers()', () => {
  it('returns configured browsers', () => {
    settings.configuration = { testing: { browsers: ['Firefox', 'Chrome'] } };
    expect(settings.browsers()).toEqual(['Firefox', 'Chrome']);
  });
});
