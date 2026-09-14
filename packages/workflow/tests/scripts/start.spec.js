/* eslint-disable max-classes-per-file */
function makeSettings(overrides = {}) {
  return {
    log: vi.fn(),
    isEkko: vi.fn(() => true),
    isDryRun: vi.fn(() => false),
    isDevelopment: vi.fn(() => true),
    host: vi.fn(() => 'localhost'),
    port: vi.fn(() => 3000),
    ekkoPort: vi.fn(() => 9999),
    output: vi.fn(() => '/fake/dist'),
    pkg: vi.fn(() => ({ name: 'test-app' })),
    historyFallback: vi.fn(() => true),
    enableHotLoader: vi.fn(() => false),
    infrastructureLogLevel: vi.fn(() => 'warn'),
    config: vi.fn(() => ({
      ekko: {
        data: '/fake/data',
        routes: '/fake/routes.json',
        plugins: [],
        pluginContext: 'http://localhost:9999/api',
      },
      development: { webpackDevServer: {} },
    })),
    ...overrides,
  };
}

describe('start', () => {
  let start;
  let mockLogger;
  let mockWebpack;
  let mockWebpackDevServer;
  let mockDevServerInstance;
  let mockEkko;
  let mockEkkoInstance;
  let mockProgressPlugin;
  let mockDoneHook;
  let mockInvalidHook;

  beforeEach(async () => {
    vi.resetModules();

    mockLogger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      failed: vi.fn(),
      success: vi.fn(),
      box: vi.fn(),
      simple: vi.fn(),
      empty: vi.fn(),
      message: vi.fn(),
    };

    // Track the done hook callback so tests can trigger it
    mockDoneHook = { tap: vi.fn() };
    mockInvalidHook = { tap: vi.fn() };

    mockProgressPlugin = vi.fn(
      class MockProgressPlugin {
        constructor(handler) {
          this.handler = handler;
        }
      }
    );

    mockDevServerInstance = {
      start: vi.fn(() => Promise.resolve()),
      stop: vi.fn(() => Promise.resolve()),
    };

    mockWebpackDevServer = vi.fn(
      class MockWebpackDevServer {
        constructor() {
          this.start = mockDevServerInstance.start;
          this.stop = mockDevServerInstance.stop;
        }
      }
    );

    const mockCompiler = {
      hooks: {
        done: mockDoneHook,
        invalid: mockInvalidHook,
      },
    };

    mockWebpack = vi.fn(() => mockCompiler);
    mockWebpack.ProgressPlugin = mockProgressPlugin;

    mockEkkoInstance = {
      start: vi.fn(() => Promise.resolve()),
      stop: vi.fn(() => Promise.resolve()),
    };

    // Must be a class so `new Ekko()` works correctly.
    // Assigns start/stop from the tracked instance so assertions work.
    const trackedInstance = mockEkkoInstance;
    mockEkko = vi.fn(
      class MockEkko {
        constructor() {
          this.start = trackedInstance.start;
          this.stop = trackedInstance.stop;
        }
      }
    );

    vi.doMock('webpack', () => ({ default: mockWebpack }));
    vi.doMock('webpack-dev-server', () => ({ default: mockWebpackDevServer }));
    vi.doMock('@availity/mock-server', () => ({ default: mockEkko }));
    vi.doMock('@availity/workflow-logger', () => ({ default: mockLogger }));
    vi.doMock('chalk', () => ({
      default: {
        yellow: Object.assign((s) => s, { bold: (s) => s }),
        green: (s) => s,
        red: (s) => s,
        dim: (s) => s,
        blue: (s) => s,
      },
    }));
    vi.doMock('../../webpack.config.js', () => ({ default: vi.fn(() => ({ plugins: [] })) }));
    vi.doMock('../../webpack.config.profile.js', () => ({ default: vi.fn(() => ({ plugins: [] })) }));
    vi.doMock('../../scripts/proxy.js', () => ({ default: vi.fn(() => null) }));
    vi.doMock('../../scripts/open.js', () => ({ default: vi.fn() }));
    vi.doMock('../../scripts/format.js', () => ({
      default: vi.fn(() => ({ errors: [], warnings: [] })),
    }));
    vi.doMock('../../helpers/deep-merge.js', () => ({
      default: (...objs) => Object.assign({}, ...objs),
    }));

    const mod = await import('../../scripts/start.js');
    start = mod.default;
  });

  it('starts Ekko before webpack dev server', async () => {
    const settings = makeSettings();
    const callOrder = [];

    mockEkkoInstance.start.mockImplementation(() => {
      callOrder.push('ekko');
      return Promise.resolve();
    });
    mockDevServerInstance.start.mockImplementation(() => {
      callOrder.push('webpack');
      // Simulate the done hook firing with success after server starts
      const doneCallback = mockDoneHook.tap.mock.calls[0][1];
      doneCallback({
        hasErrors: () => false,
        hasWarnings: () => false,
        toJson: () => ({ errors: [], warnings: [] }),
      });
      return Promise.resolve();
    });

    await start({ settings });

    expect(callOrder).toEqual(['ekko', 'webpack']);
  });

  it('skips Ekko when isEkko() returns false', async () => {
    const settings = makeSettings({ isEkko: vi.fn(() => false) });

    mockDevServerInstance.start.mockImplementation(() => {
      const doneCallback = mockDoneHook.tap.mock.calls[0][1];
      doneCallback({
        hasErrors: () => false,
        hasWarnings: () => false,
        toJson: () => ({ errors: [], warnings: [] }),
      });
      return Promise.resolve();
    });

    await start({ settings });

    expect(mockEkko).not.toHaveBeenCalled();
  });

  it('stops both webpack dev server and Ekko when compilation fails', async () => {
    const settings = makeSettings();

    // server.start() resolves, but the done hook fires with compilation errors.
    // We trigger it synchronously inside start() to avoid race conditions.
    mockDevServerInstance.start.mockImplementation(async () => {
      const doneCallback = mockDoneHook.tap.mock.calls[0][1];
      await doneCallback({
        hasErrors: () => true,
        hasWarnings: () => false,
        toJson: () => ({
          errors: [{ message: 'Module not found' }],
          warnings: [],
        }),
      });
    });

    await expect(start({ settings })).rejects.toThrow();

    expect(mockDevServerInstance.stop).toHaveBeenCalled();
    expect(mockEkkoInstance.stop).toHaveBeenCalled();
  });

  it('stops both servers when server.start() itself throws', async () => {
    const settings = makeSettings();

    mockDevServerInstance.start.mockRejectedValue(new Error('EADDRINUSE'));

    await expect(start({ settings })).rejects.toThrow('EADDRINUSE');

    expect(mockDevServerInstance.stop).toHaveBeenCalled();
    // ekko.stop is called because ekko started successfully before web() was called
    expect(mockEkkoInstance.stop).toHaveBeenCalled();
  });

  it('still rejects with the original error even if stop() calls throw', async () => {
    const settings = makeSettings();

    mockDevServerInstance.start.mockRejectedValue(new Error('server start failed'));
    mockDevServerInstance.stop.mockRejectedValue(new Error('stop also failed'));
    mockEkkoInstance.stop.mockRejectedValue(new Error('ekko stop failed'));

    // Should reject with the original error, not the cleanup errors
    await expect(start({ settings })).rejects.toThrow('server start failed');
  });

  it('does not stop servers on successful start', async () => {
    const settings = makeSettings();

    mockDevServerInstance.start.mockImplementation(() => {
      const doneCallback = mockDoneHook.tap.mock.calls[0][1];
      doneCallback({
        hasErrors: () => false,
        toJson: () => ({ errors: [], warnings: [] }),
      });
      return Promise.resolve();
    });

    await start({ settings });

    expect(mockDevServerInstance.stop).not.toHaveBeenCalled();
    expect(mockEkkoInstance.stop).not.toHaveBeenCalled();
  });
});
