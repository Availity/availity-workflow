/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
describe('lint', () => {
  let lint;
  let mockReaddir;
  let mockOraSpinner;
  let mockLogger;
  let mockCreateRequire;
  let mockSettings;
  let mockESLint;
  let mockFormatter;
  let mockEngine;

  beforeEach(async () => {
    vi.resetModules();
    process.exitCode = undefined;

    mockFormatter = { format: vi.fn(() => 'lint output') };
    mockEngine = {
      lintFiles: vi.fn(() => []),
      loadFormatter: vi.fn(() => mockFormatter),
    };
    mockESLint = vi.fn(function () {
      return mockEngine;
    });

    mockReaddir = vi.fn(() => ['index.js', 'app.js']);
    vi.doMock('fs/promises', () => ({ readdir: mockReaddir }));

    mockOraSpinner = { start: vi.fn(), stop: vi.fn(), color: '' };
    vi.doMock('ora', () => ({ default: vi.fn(() => mockOraSpinner) }));

    vi.doMock('chalk', () => ({ default: { magenta: vi.fn((v) => v) } }));

    mockLogger = {
      info: vi.fn(),
      warn: vi.fn(),
      success: vi.fn(),
      failed: vi.fn(),
      simple: vi.fn(),
    };
    vi.doMock('@availity/workflow-logger', () => ({ default: mockLogger }));

    mockCreateRequire = vi.fn(() => vi.fn(() => ({ ESLint: mockESLint })));
    vi.doMock('module', () => ({ createRequire: mockCreateRequire }));

    vi.doMock('child_process', () => ({ execFile: vi.fn((cmd, args, cb) => cb(null, '', '')) }));
    vi.doMock('util', () => ({
      promisify:
        (fn) =>
        (...args) =>
          new Promise((resolve, reject) => {
            fn(...args, (err, stdout, stderr) => {
              if (err) reject(err);
              else resolve({ stdout, stderr });
            });
          }),
    }));

    mockSettings = {
      isLinterDisabled: vi.fn(() => false),
      project: vi.fn(() => '/project'),
      isIgnoreUntracked: vi.fn(() => false),
      js: vi.fn(() => ['src/**/*.js']),
      isFail: vi.fn(() => false),
    };

    const mod = await import('../../scripts/lint.js');
    lint = mod.default;
  });

  it('returns true immediately when linting is disabled', async () => {
    mockSettings.isLinterDisabled.mockReturnValue(true);
    const result = await lint({ settings: mockSettings });
    expect(result).toBe(true);
    expect(mockLogger.warn).toHaveBeenCalledWith('Linting is disabled');
    expect(mockReaddir).not.toHaveBeenCalled();
  });

  it('falls back to import("eslint") when createRequire throws', async () => {
    vi.resetModules();

    const fallbackESLint = vi.fn(function () {
      return mockEngine;
    });
    const throwingRequire = vi.fn(() => {
      throw new Error('not found');
    });

    vi.doMock('fs/promises', () => ({ readdir: mockReaddir }));
    vi.doMock('ora', () => ({ default: vi.fn(() => mockOraSpinner) }));
    vi.doMock('chalk', () => ({ default: { magenta: vi.fn((v) => v) } }));
    vi.doMock('@availity/workflow-logger', () => ({ default: mockLogger }));
    vi.doMock('module', () => ({ createRequire: vi.fn(() => throwingRequire) }));
    vi.doMock('child_process', () => ({ execFile: vi.fn((cmd, args, cb) => cb(null, '', '')) }));
    vi.doMock('util', () => ({
      promisify:
        (fn) =>
        (...args) =>
          new Promise((resolve, reject) => {
            fn(...args, (err, stdout, stderr) => {
              if (err) reject(err);
              else resolve({ stdout, stderr });
            });
          }),
    }));
    vi.doMock('eslint', () => ({ default: { ESLint: fallbackESLint } }));

    const mod = await import('../../scripts/lint.js');
    const lintFallback = mod.default;

    const result = await lintFallback({ settings: mockSettings });
    expect(result).toBe(true);
    expect(fallbackESLint).toHaveBeenCalled();
  });

  it('throws when both eslint loading approaches fail', async () => {
    vi.resetModules();

    const throwingRequire = vi.fn(() => {
      throw new Error('not found');
    });

    vi.doMock('fs/promises', () => ({ readdir: mockReaddir }));
    vi.doMock('ora', () => ({ default: vi.fn(() => mockOraSpinner) }));
    vi.doMock('chalk', () => ({ default: { magenta: vi.fn((v) => v) } }));
    vi.doMock('@availity/workflow-logger', () => ({ default: mockLogger }));
    vi.doMock('module', () => ({ createRequire: vi.fn(() => throwingRequire) }));
    vi.doMock('child_process', () => ({ execFile: vi.fn((cmd, args, cb) => cb(null, '', '')) }));
    vi.doMock('util', () => ({
      promisify:
        (fn) =>
        (...args) =>
          new Promise((resolve, reject) => {
            fn(...args, (err, stdout, stderr) => {
              if (err) reject(err);
              else resolve({ stdout, stderr });
            });
          }),
    }));
    vi.doMock('eslint', () => {
      throw new Error('eslint not available');
    });

    const mod = await import('../../scripts/lint.js');
    const lintBroken = mod.default;

    await expect(lintBroken({ settings: mockSettings })).rejects.toThrow('Unable to load eslint.');
    expect(mockLogger.failed).toHaveBeenCalledWith('Failed linting. Unable to load eslint.');
  });

  it('throws on ESLint configuration error', async () => {
    vi.resetModules();

    const badESLint = vi.fn(function () {
      throw new Error('Invalid config');
    });

    vi.doMock('fs/promises', () => ({ readdir: mockReaddir }));
    vi.doMock('ora', () => ({ default: vi.fn(() => mockOraSpinner) }));
    vi.doMock('chalk', () => ({ default: { magenta: vi.fn((v) => v) } }));
    vi.doMock('@availity/workflow-logger', () => ({ default: mockLogger }));
    vi.doMock('module', () => ({ createRequire: vi.fn(() => vi.fn(() => ({ ESLint: badESLint }))) }));
    vi.doMock('child_process', () => ({ execFile: vi.fn((cmd, args, cb) => cb(null, '', '')) }));
    vi.doMock('util', () => ({
      promisify:
        (fn) =>
        (...args) =>
          new Promise((resolve, reject) => {
            fn(...args, (err, stdout, stderr) => {
              if (err) reject(err);
              else resolve({ stdout, stderr });
            });
          }),
    }));

    const mod = await import('../../scripts/lint.js');
    const lintBadConfig = mod.default;

    await expect(lintBadConfig({ settings: mockSettings })).rejects.toThrow('ESLint configuration error');
    expect(mockLogger.failed).toHaveBeenCalledWith(expect.stringContaining('ESLint configuration error'));
  });

  it('passes glob patterns from settings.js() to lintFiles', async () => {
    mockSettings.js.mockReturnValue(['src/**/*.js', 'lib/**/*.jsx']);
    await lint({ settings: mockSettings });
    expect(mockEngine.lintFiles).toHaveBeenCalledWith(['src/**/*.js', 'lib/**/*.jsx']);
  });

  it('reports success when no errors or warnings', async () => {
    mockEngine.lintFiles.mockResolvedValue([{ errorCount: 0, warningCount: 0 }]);

    const result = await lint({ settings: mockSettings });
    expect(result).toBe(true);
    expect(mockLogger.success).toHaveBeenCalledWith(expect.stringContaining('Finished linting'));
    expect(mockLogger.failed).not.toHaveBeenCalled();
  });

  it('returns false and sets exit code when errors exist', async () => {
    mockEngine.lintFiles.mockResolvedValue([{ errorCount: 2, warningCount: 0 }]);

    const result = await lint({ settings: mockSettings });
    expect(result).toBe(false);
    expect(process.exitCode).toBe(1);
    expect(mockLogger.failed).toHaveBeenCalledWith('Failed linting');
  });

  it('logs warning when only warnings exist', async () => {
    mockEngine.lintFiles.mockResolvedValue([{ errorCount: 0, warningCount: 3 }]);

    await lint({ settings: mockSettings });
    expect(mockLogger.warn).toHaveBeenCalledWith('Passed linting with warnings');
    expect(mockLogger.simple).toHaveBeenCalledWith('lint output');
  });
});
