let lint;
let mockEngine;
let mockFormatter;
let mockESLint;
let mockLogger;
let mockOra;
let mockSpinner;
let mockSettings;

function makeSettings(eslintConfig = {}) {
  return {
    isLinterDisabled: vi.fn(() => false),
    project: vi.fn(() => '/project'),
    isIgnoreUntracked: vi.fn(() => false),
    isVerbose: vi.fn(() => false),
    js: vi.fn(() => ['src/**/*.js']),
    config: vi.fn(() => ({ eslint: eslintConfig })),
  };
}

function makeReport({ errorCount = 0, warningCount = 0, filePath = 'src/index.js' } = {}) {
  return [{ errorCount, warningCount, filePath }];
}

beforeEach(async () => {
  vi.resetModules();

  mockFormatter = { format: vi.fn(() => 'lint output') };
  mockEngine = {
    lintFiles: vi.fn(async () => makeReport()),
    loadFormatter: vi.fn(async () => mockFormatter),
  };
  // Use a real constructable function (not an arrow) so `new mockESLint()` works
  // across vmThreads. Track constructor options on _lastOpts; delegate to mockEngine.

  function MockESLint(opts) {
    MockESLint._lastOpts = opts;
  }
  MockESLint.prototype.lintFiles = (...args) => mockEngine.lintFiles(...args);
  MockESLint.prototype.loadFormatter = (...args) => mockEngine.loadFormatter(...args);
  MockESLint._lastOpts = null;
  MockESLint.getErrorResults = vi.fn((results) => results.filter((r) => r.errorCount > 0));
  MockESLint.outputFixes = vi.fn(async () => {});
  mockESLint = MockESLint;

  mockSpinner = { start: vi.fn(), stop: vi.fn(), color: '' };
  mockOra = vi.fn(() => mockSpinner);

  mockLogger = {
    info: vi.fn(),
    warn: vi.fn(),
    success: vi.fn(),
    failed: vi.fn(),
    simple: vi.fn(),
  };

  vi.doMock('ora', () => ({ default: mockOra }));
  vi.doMock('chalk', () => ({ default: { magenta: (v) => v, cyan: (v) => v, dim: (v) => v } }));
  vi.doMock('@availity/workflow-logger', () => ({ default: mockLogger }));
  vi.doMock('module', () => ({
    createRequire: vi.fn(() => vi.fn(() => ({ ESLint: mockESLint }))),
  }));
  vi.doMock('child_process', () => ({
    execFile: vi.fn((cmd, args, cb) => cb(null, '', '')),
  }));
  vi.doMock('util', () => ({
    promisify:
      (fn) =>
      (...args) =>
        new Promise((resolve, reject) => {
          fn(...args, (err, stdout, stderr) => (err ? reject(err) : resolve({ stdout, stderr })));
        }),
  }));

  mockSettings = makeSettings();
  const mod = await import('../../scripts/lint.js');
  lint = mod.default;
});

// ---------------------------------------------------------------------------
// basic flow
// ---------------------------------------------------------------------------
describe('lint — basic flow', () => {
  it('returns true immediately when linting is disabled', async () => {
    mockSettings.isLinterDisabled.mockReturnValue(true);
    const result = await lint({ settings: mockSettings });
    expect(result).toBe(true);
    expect(mockLogger.warn).toHaveBeenCalledWith('Linting is disabled');
  });

  it('reports success when no errors or warnings', async () => {
    const result = await lint({ settings: mockSettings });
    expect(result).toBe(true);
    expect(mockLogger.success).toHaveBeenCalledWith(
      expect.stringMatching(/Finished linting .* file\(s\) in \d+(\.\d+)?(ms|s)/)
    );
  });

  it('passes file patterns from settings.js() to lintFiles', async () => {
    mockSettings.js.mockReturnValue(['src/**/*.ts', 'lib/**/*.tsx']);
    await lint({ settings: mockSettings });
    expect(mockEngine.lintFiles).toHaveBeenCalledWith(['src/**/*.ts', 'lib/**/*.tsx']);
  });

  it('prints each file when verbose is enabled', async () => {
    mockEngine.lintFiles.mockResolvedValue([
      { errorCount: 0, warningCount: 0, filePath: '/project/src/a.ts' },
      { errorCount: 0, warningCount: 0, filePath: '/project/src/b.ts' },
    ]);
    mockSettings.isVerbose = vi.fn(() => true);
    await lint({ settings: mockSettings });
    expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('2'));
    expect(mockLogger.simple).toHaveBeenCalledWith(expect.stringContaining('/project/src/a.ts'));
    expect(mockLogger.simple).toHaveBeenCalledWith(expect.stringContaining('/project/src/b.ts'));
  });

  it('does not print file list when verbose is disabled', async () => {
    mockEngine.lintFiles.mockResolvedValue([{ errorCount: 0, warningCount: 0, filePath: '/project/src/a.ts' }]);
    mockSettings.isVerbose = vi.fn(() => false);
    await lint({ settings: mockSettings });
    expect(mockLogger.simple).not.toHaveBeenCalledWith(expect.stringContaining('/project/src/a.ts'));
  });
});

// ---------------------------------------------------------------------------
// failOnError (default: true)
// ---------------------------------------------------------------------------
describe('lint — failOnError', () => {
  it('throws and logs failure when errors exist (default)', async () => {
    mockEngine.lintFiles.mockResolvedValue(makeReport({ errorCount: 2 }));
    mockSettings = makeSettings({ failOnError: true });
    await expect(lint({ settings: mockSettings })).rejects.toThrow('Failed linting');
    expect(mockLogger.failed).toHaveBeenCalledWith('Failed linting');
  });

  it('does not throw when failOnError is false even with errors', async () => {
    mockEngine.lintFiles.mockResolvedValue(makeReport({ errorCount: 1 }));
    mockSettings = makeSettings({ failOnError: false });
    const result = await lint({ settings: mockSettings });
    expect(result).toBe(true);
    expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('failOnError is disabled'));
  });
});

// ---------------------------------------------------------------------------
// failOnWarning (default: false)
// ---------------------------------------------------------------------------
describe('lint — failOnWarning', () => {
  it('passes with warnings when failOnWarning is false (default)', async () => {
    mockEngine.lintFiles.mockResolvedValue(makeReport({ warningCount: 3 }));
    mockSettings = makeSettings({ failOnWarning: false });
    const result = await lint({ settings: mockSettings });
    expect(result).toBe(true);
    expect(mockLogger.warn).toHaveBeenCalledWith('Passed linting with warnings');
  });

  it('throws when failOnWarning is true and warnings exist', async () => {
    mockEngine.lintFiles.mockResolvedValue(makeReport({ warningCount: 1 }));
    mockSettings = makeSettings({ failOnWarning: true });
    await expect(lint({ settings: mockSettings })).rejects.toThrow();
    expect(mockLogger.failed).toHaveBeenCalledWith(expect.stringContaining('failOnWarning'));
  });

  it('passes when failOnWarning is true but no warnings', async () => {
    mockEngine.lintFiles.mockResolvedValue(makeReport({ warningCount: 0 }));
    mockSettings = makeSettings({ failOnWarning: true });
    const result = await lint({ settings: mockSettings });
    expect(result).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// maxWarnings
// ---------------------------------------------------------------------------
describe('lint — maxWarnings', () => {
  it('passes when warnings are within the limit', async () => {
    mockEngine.lintFiles.mockResolvedValue([
      { errorCount: 0, warningCount: 3 },
      { errorCount: 0, warningCount: 2 },
    ]);
    mockSettings = makeSettings({ maxWarnings: 10 });
    const result = await lint({ settings: mockSettings });
    expect(result).toBe(true);
  });

  it('fails when warnings exceed the limit', async () => {
    mockEngine.lintFiles.mockResolvedValue([
      { errorCount: 0, warningCount: 4 },
      { errorCount: 0, warningCount: 4 },
    ]);
    mockSettings = makeSettings({ maxWarnings: 5 });
    await expect(lint({ settings: mockSettings })).rejects.toThrow();
    expect(mockLogger.failed).toHaveBeenCalledWith(expect.stringContaining('maxWarnings limit of 5'));
  });

  it('fails when maxWarnings is 0 and any warning exists', async () => {
    mockEngine.lintFiles.mockResolvedValue(makeReport({ warningCount: 1 }));
    mockSettings = makeSettings({ maxWarnings: 0 });
    await expect(lint({ settings: mockSettings })).rejects.toThrow();
  });

  it('maxWarnings takes precedence over failOnWarning: false', async () => {
    mockEngine.lintFiles.mockResolvedValue(makeReport({ warningCount: 2 }));
    mockSettings = makeSettings({ maxWarnings: 1, failOnWarning: false });
    await expect(lint({ settings: mockSettings })).rejects.toThrow();
  });
});

// ---------------------------------------------------------------------------
// quiet
// ---------------------------------------------------------------------------
describe('lint — quiet', () => {
  it('calls ESLint.getErrorResults to filter warnings when quiet is true', async () => {
    mockEngine.lintFiles.mockResolvedValue(makeReport({ warningCount: 3 }));
    mockSettings = makeSettings({ quiet: true });
    await lint({ settings: mockSettings });
    expect(mockESLint.getErrorResults).toHaveBeenCalled();
  });

  it('does not call getErrorResults when quiet is false', async () => {
    mockSettings = makeSettings({ quiet: false });
    await lint({ settings: mockSettings });
    expect(mockESLint.getErrorResults).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// fix
// ---------------------------------------------------------------------------
describe('lint — fix', () => {
  it('passes fix: true to the ESLint constructor', async () => {
    mockSettings = makeSettings({ fix: true });
    await lint({ settings: mockSettings });
    expect(mockESLint._lastOpts).toMatchObject({ fix: true });
  });

  it('calls ESLint.outputFixes when fix is true', async () => {
    mockSettings = makeSettings({ fix: true });
    await lint({ settings: mockSettings });
    expect(mockESLint.outputFixes).toHaveBeenCalled();
  });

  it('does not call outputFixes when fix is false', async () => {
    mockSettings = makeSettings({ fix: false });
    await lint({ settings: mockSettings });
    expect(mockESLint.outputFixes).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// ESLint loading
// ---------------------------------------------------------------------------
describe('lint — ESLint loading', () => {
  it('falls back to import("eslint") when createRequire fails', async () => {
    vi.resetModules();
    function FallbackESLint() {}
    FallbackESLint.prototype.lintFiles = (...args) => mockEngine.lintFiles(...args);
    FallbackESLint.prototype.loadFormatter = (...args) => mockEngine.loadFormatter(...args);
    FallbackESLint.getErrorResults = vi.fn((r) => r.filter((x) => x.errorCount > 0));
    FallbackESLint.outputFixes = vi.fn(async () => {});
    vi.doMock('ora', () => ({ default: mockOra }));
    vi.doMock('chalk', () => ({ default: { magenta: (v) => v, cyan: (v) => v, dim: (v) => v } }));
    vi.doMock('@availity/workflow-logger', () => ({ default: mockLogger }));
    vi.doMock('module', () => ({
      createRequire: vi.fn(() =>
        vi.fn(() => {
          throw new Error('not found');
        })
      ),
    }));
    vi.doMock('child_process', () => ({ execFile: vi.fn((cmd, args, cb) => cb(null, '', '')) }));
    vi.doMock('util', () => ({
      promisify:
        (fn) =>
        (...args) =>
          new Promise((resolve, reject) => {
            fn(...args, (err, stdout, stderr) => (err ? reject(err) : resolve({ stdout, stderr })));
          }),
    }));
    vi.doMock('eslint', () => ({ default: { ESLint: FallbackESLint } }));
    const mod = await import('../../scripts/lint.js');
    const lintFallback = mod.default;
    await lintFallback({ settings: mockSettings });
    // fallbackESLint is a class — verify it was used by checking the engine was called
    expect(mockEngine.lintFiles).toHaveBeenCalled();
  });

  it('throws when both ESLint load strategies fail', async () => {
    vi.resetModules();
    vi.doMock('ora', () => ({ default: mockOra }));
    vi.doMock('chalk', () => ({ default: { magenta: (v) => v, cyan: (v) => v, dim: (v) => v } }));
    vi.doMock('@availity/workflow-logger', () => ({ default: mockLogger }));
    vi.doMock('module', () => ({
      createRequire: vi.fn(() =>
        vi.fn(() => {
          throw new Error('not found');
        })
      ),
    }));
    vi.doMock('child_process', () => ({ execFile: vi.fn((cmd, args, cb) => cb(null, '', '')) }));
    vi.doMock('util', () => ({
      promisify:
        (fn) =>
        (...args) =>
          new Promise((resolve, reject) => {
            fn(...args, (err, stdout, stderr) => (err ? reject(err) : resolve({ stdout, stderr })));
          }),
    }));
    vi.doMock('eslint', () => {
      throw new Error('not available');
    });
    const mod = await import('../../scripts/lint.js');
    await expect(mod.default({ settings: mockSettings })).rejects.toThrow('Unable to load eslint.');
  });
});
