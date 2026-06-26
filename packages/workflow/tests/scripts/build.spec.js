const mockRmSync = vi.fn();
const mockWebpackRun = vi.fn();
const mockWebpack = vi.fn(() => ({ run: mockWebpackRun }));
const mockSpinner = { color: '', start: vi.fn(), stop: vi.fn(), text: '' };
const mockOra = vi.fn(() => mockSpinner);
const mockViteBuild = vi.fn(() => Promise.resolve());

let bundle;

beforeEach(async () => {
  vi.resetModules();
  mockRmSync.mockReset();
  mockWebpackRun.mockReset();
  mockWebpack.mockReset().mockReturnValue({ run: mockWebpackRun });
  mockSpinner.start.mockReset();
  mockSpinner.stop.mockReset();
  mockOra.mockReset().mockReturnValue(mockSpinner);
  mockViteBuild.mockReset().mockResolvedValue(undefined);

  vi.doMock('fs', () => ({
    default: { rmSync: mockRmSync, promises: { rm: mockRmSync } },
  }));

  vi.doMock('webpack', () => ({
    default: Object.assign(mockWebpack, {
      ProgressPlugin: class ProgressPlugin {
        constructor(handler) {
          this.handler = handler;
        }
      },
    }),
  }));

  vi.doMock('ora', () => ({
    default: mockOra,
  }));

  vi.doMock('chalk', () => ({
    default: { yellow: (s) => s, green: (s) => s, red: (s) => s, dim: (s) => s },
  }));

  vi.doMock('@availity/workflow-logger', () => ({
    default: {
      info: vi.fn(),
      success: vi.fn(),
      error: vi.fn(),
      failed: vi.fn(),
      warn: vi.fn(),
    },
  }));

  vi.doMock('webpack-bundle-size-analyzer/build/src/size_tree', () => ({
    default: vi.fn(),
  }));

  vi.doMock('../../webpack.config.production.js', () => ({
    default: vi.fn(() => ({ plugins: [] })),
  }));

  vi.doMock('../../webpack.config.profile.js', () => ({
    default: vi.fn(() => ({ plugins: [] })),
  }));

  vi.doMock('../../scripts/stats.js', () => ({
    default: vi.fn(() => 'mock stats'),
  }));

  vi.doMock('vite', () => ({
    build: mockViteBuild,
  }));

  vi.doMock('../../vite.config.production.js', () => ({
    default: vi.fn(() => ({ build: {} })),
  }));

  vi.doMock('yargs', () => ({
    default: () => ({ parseSync: () => ({}) }),
  }));

  const mod = await import('../../scripts/build.js');
  bundle = mod.default;
});

function makeSettings(overrides = {}) {
  return {
    isDryRun: vi.fn(() => false),
    isProfile: vi.fn(() => false),
    output: vi.fn(() => '/fake/output'),
    config: vi.fn(() => ({})),
    ...overrides,
  };
}

describe('bundle', () => {
  it('calls webpack', async () => {
    const settings = makeSettings();
    mockWebpackRun.mockImplementation((cb) => {
      cb(null, {
        hasErrors: () => false,
        hasWarnings: () => false,
      });
    });

    await bundle({ settings });

    expect(mockWebpack).toHaveBeenCalled();
  });
});

describe('bundleWebpack', () => {
  it('calls fs.rmSync when not dry run', async () => {
    const settings = makeSettings();
    mockWebpackRun.mockImplementation((cb) => {
      cb(null, { hasErrors: () => false, hasWarnings: () => false });
    });

    await bundle({ settings });

    expect(mockRmSync).toHaveBeenCalledWith('/fake/output', { recursive: true, force: true });
  });

  it('skips fs.rmSync during dry run', async () => {
    const settings = makeSettings({ isDryRun: vi.fn(() => true) });
    mockWebpackRun.mockImplementation((cb) => {
      cb(null, { hasErrors: () => false, hasWarnings: () => false });
    });

    await bundle({ settings });

    expect(mockRmSync).not.toHaveBeenCalled();
  });

  it('resolves on successful compilation', async () => {
    const settings = makeSettings();
    mockWebpackRun.mockImplementation((cb) => {
      cb(null, { hasErrors: () => false, hasWarnings: () => false });
    });

    await expect(bundle({ settings })).resolves.toBeUndefined();
  });

  it('rejects on webpack error', async () => {
    const settings = makeSettings();
    const webpackError = new Error('compilation failed');
    mockWebpackRun.mockImplementation((cb) => {
      cb(webpackError);
    });

    await expect(bundle({ settings })).rejects.toBe(webpackError);
  });
});


