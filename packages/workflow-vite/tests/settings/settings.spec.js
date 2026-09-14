import path from 'node:path';
import Settings from '../../settings/index.js';
import paths from '../../helpers/paths.js';

const originalNodeEnv = process.env.NODE_ENV;

let settings;

beforeEach(() => {
  settings = new Settings();
});

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
});

// ---------------------------------------------------------------------------
// environment()
// ---------------------------------------------------------------------------
describe('environment()', () => {
  it('returns NODE_ENV when set', () => {
    process.env.NODE_ENV = 'production';
    expect(settings.environment()).toBe('production');
  });

  it('defaults to development when NODE_ENV is not set', () => {
    delete process.env.NODE_ENV;
    expect(settings.environment()).toBe('development');
  });

  it('sets NODE_ENV to development as a side effect', () => {
    delete process.env.NODE_ENV;
    settings.environment();
    expect(process.env.NODE_ENV).toBe('development');
  });
});

// ---------------------------------------------------------------------------
// environment boolean checks
// ---------------------------------------------------------------------------
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

  it('returns false for non-test envs', () => {
    process.env.NODE_ENV = 'development';
    expect(settings.isTesting()).toBe(false);
  });
});

describe('isProduction()', () => {
  it('returns true when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';
    expect(settings.isProduction()).toBe(true);
  });

  it('returns true when --production argv is set', () => {
    process.env.NODE_ENV = 'development';
    settings = new Settings({ production: true });
    expect(settings.isProduction()).toBeTruthy();
  });

  it('returns false in development', () => {
    process.env.NODE_ENV = 'development';
    expect(settings.isProduction()).toBe(false);
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

  it('returns false otherwise', () => {
    process.env.NODE_ENV = 'development';
    settings.shouldMimicStaging = false;
    expect(settings.isStaging()).toBe(false);
  });
});

describe('isDistribution()', () => {
  it('returns true in production', () => {
    process.env.NODE_ENV = 'production';
    expect(settings.isDistribution()).toBe(true);
  });

  it('returns true in staging', () => {
    process.env.NODE_ENV = 'staging';
    expect(settings.isDistribution()).toBe(true);
  });

  it('returns false in development', () => {
    process.env.NODE_ENV = 'development';
    expect(settings.isDistribution()).toBe(false);
  });
});

describe('isDryRun()', () => {
  it('returns true when dryRun argv is set', () => {
    settings = new Settings({ dryRun: true });
    expect(settings.isDryRun()).toBe(true);
  });

  it('returns false without the flag', () => {
    expect(settings.isDryRun()).toBe(false);
  });
});

describe('isVerbose()', () => {
  it('returns true when verbose argv is set', () => {
    settings = new Settings({ verbose: true });
    expect(settings.isVerbose()).toBe(true);
  });

  it('returns false without the flag', () => {
    expect(settings.isVerbose()).toBe(false);
  });

  it('returns false when verbose is undefined', () => {
    settings = new Settings({ verbose: undefined });
    expect(settings.isVerbose()).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// config accessors
// ---------------------------------------------------------------------------
describe('title()', () => {
  it('returns configured title', () => {
    settings.configuration = { app: { title: 'My App' } };
    expect(settings.title()).toBe('My App');
  });

  it('defaults to Availity', () => {
    settings.configuration = {};
    expect(settings.title()).toBe('Availity');
  });
});

describe('host()', () => {
  it('returns configured host', () => {
    settings.configuration = { development: { host: '0.0.0.0' } };
    expect(settings.host()).toBe('0.0.0.0');
  });

  it('defaults to localhost', () => {
    settings.configuration = { development: {} };
    expect(settings.host()).toBe('localhost');
  });

  it('defaults to localhost when development is absent', () => {
    settings.configuration = {};
    expect(settings.host()).toBe('localhost');
  });
});

describe('port()', () => {
  it('returns devServerPort', () => {
    settings.devServerPort = 3000;
    expect(settings.port()).toBe(3000);
  });
});

describe('ekkoPort()', () => {
  it('returns ekkoServerPort', () => {
    settings.ekkoServerPort = 9999;
    expect(settings.ekkoPort()).toBe(9999);
  });
});

describe('ekkoPluginContext()', () => {
  it('returns configured pluginContext when set', () => {
    settings.configuration = { ekko: { pluginContext: 'http://custom:8888/api' } };
    expect(settings.ekkoPluginContext()).toBe('http://custom:8888/api');
  });

  it('defaults to http://{host}:{port}/api using resolved values', () => {
    settings.configuration = { development: { host: 'localhost' } };
    settings.devServerPort = 3000;
    expect(settings.ekkoPluginContext()).toBe('http://localhost:3000/api');
  });

  it('uses custom host in the default', () => {
    settings.configuration = { development: { host: '0.0.0.0' } };
    settings.devServerPort = 8080;
    expect(settings.ekkoPluginContext()).toBe('http://0.0.0.0:8080/api');
  });
});

describe('open()', () => {
  it('returns the configured open path', () => {
    settings.configuration = { development: { open: '/dashboard' } };
    expect(settings.open()).toBe('/dashboard');
  });

  it('returns false when explicitly set to false', () => {
    settings.configuration = { development: { open: false } };
    expect(settings.open()).toBe(false);
  });

  it('returns undefined when development has no open', () => {
    settings.configuration = { development: {} };
    expect(settings.open()).toBeUndefined();
  });
});

describe('isEkko()', () => {
  it('returns true by default', () => {
    settings.configuration = { ekko: {} };
    expect(settings.isEkko()).toBe(true);
  });

  it('returns false when disabled', () => {
    settings.configuration = { ekko: { enabled: false } };
    expect(settings.isEkko()).toBe(false);
  });
});

describe('output()', () => {
  it('returns dist/ for distribution builds', () => {
    process.env.NODE_ENV = 'production';
    expect(settings.output()).toBe(path.join(paths.project, 'dist'));
  });

  it('returns build/ for non-distribution builds', () => {
    process.env.NODE_ENV = 'development';
    expect(settings.output()).toBe(path.join(paths.project, 'build'));
  });
});

describe('project() / app()', () => {
  it('project() returns paths.project', () => {
    expect(settings.project()).toBe(paths.project);
  });

  it('app() returns paths.app', () => {
    expect(settings.app()).toBe(paths.app);
  });
});

describe('config()', () => {
  it('returns the configuration object', () => {
    const cfg = { development: {}, app: {} };
    settings.configuration = cfg;
    expect(settings.config()).toBe(cfg);
  });
});

// ---------------------------------------------------------------------------
// globals()
// ---------------------------------------------------------------------------
describe('globals()', () => {
  it('includes __DEV__ true in development', () => {
    process.env.NODE_ENV = 'development';
    settings.configuration = { globals: {} };
    const g = settings.globals();
    expect(g.__DEV__).toBe(true);
    expect(g.__TEST__).toBe(false);
    expect(g.__PROD__).toBe(false);
    expect(g.__STAGING__).toBe(false);
    expect(g['process.env.NODE_ENV']).toBe('"development"');
  });

  it('includes __TEST__ true in test', () => {
    process.env.NODE_ENV = 'test';
    settings.configuration = { globals: {} };
    const g = settings.globals();
    expect(g.__TEST__).toBe(true);
    expect(g.__DEV__).toBe(false);
  });

  it('includes __PROD__ true in production', () => {
    process.env.NODE_ENV = 'production';
    settings.configuration = { globals: {} };
    const g = settings.globals();
    expect(g.__PROD__).toBe(true);
    expect(g['process.env.NODE_ENV']).toBe('"production"');
  });

  it('maps staging NODE_ENV to "production" for process.env.NODE_ENV', () => {
    process.env.NODE_ENV = 'staging';
    settings.configuration = { globals: {} };
    const g = settings.globals();
    expect(g.__STAGING__).toBe(true);
    expect(g['process.env.NODE_ENV']).toBe('"production"');
  });

  it('JSON-stringifies plain string config globals', () => {
    process.env.NODE_ENV = 'development';
    settings.configuration = { globals: { MY_FLAG: 'hello' } };
    expect(settings.globals().MY_FLAG).toBe('"hello"');
  });

  it('preserves config globals already valid JSON', () => {
    process.env.NODE_ENV = 'development';
    settings.configuration = { globals: { MY_FLAG: '"already-quoted"' } };
    expect(settings.globals().MY_FLAG).toBe('"already-quoted"');
  });

  it('overrides config globals with matching process.env values', () => {
    process.env.NODE_ENV = 'development';
    process.env.MY_FLAG = 'from-env';
    settings.configuration = { globals: { MY_FLAG: 'from-config' } };
    try {
      expect(settings.globals().MY_FLAG).toBe('"from-env"');
    } finally {
      delete process.env.MY_FLAG;
    }
  });

  it('does not expose process.env keys not declared in config globals', () => {
    process.env.NODE_ENV = 'development';
    process.env.SECRET = 'secret';
    settings.configuration = { globals: {} };
    try {
      expect(settings.globals().SECRET).toBeUndefined();
    } finally {
      delete process.env.SECRET;
    }
  });

  it('works when globals is not configured', () => {
    process.env.NODE_ENV = 'development';
    settings.configuration = {};
    const g = settings.globals();
    expect(g.__DEV__).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// js() lint patterns
// ---------------------------------------------------------------------------
describe('js()', () => {
  it('returns default app glob patterns when no argv.include', () => {
    const result = settings.js();
    expect(result).toEqual([
      `${paths.app}/**/*.js`,
      `${paths.app}/**/*.jsx`,
      `${paths.app}/**/*.ts`,
      `${paths.app}/**/*.tsx`,
    ]);
  });

  it('appends argv.include patterns to defaults', () => {
    settings = new Settings({ include: ['extra/**/*.js'] });
    const result = settings.js();
    expect(result).toContain('extra/**/*.js');
    expect(result).toHaveLength(5);
  });
});
