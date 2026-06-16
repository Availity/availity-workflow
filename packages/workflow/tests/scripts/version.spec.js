/* eslint-disable prefer-destructuring */
describe('version', () => {
  let tag;
  let prompt;
  let bump;

  let mockExecSync;
  let mockWriteFileSync;
  let mockLoggerInfo;
  let mockLoggerError;
  let mockLoggerMessage;
  let mockLoggerSuccess;
  let mockSettings;
  let mockYargsArgv;

  beforeEach(async () => {
    vi.resetModules();

    mockExecSync = vi.fn();
    mockWriteFileSync = vi.fn();
    mockLoggerInfo = vi.fn();
    mockLoggerError = vi.fn();
    mockLoggerMessage = vi.fn();
    mockLoggerSuccess = vi.fn();
    mockYargsArgv = {};

    mockSettings = {
      isDistribution: vi.fn().mockReturnValue(false),
      isDryRun: vi.fn().mockReturnValue(false),
      version: undefined,
      pkg: vi.fn().mockReturnValue({ name: 'test-pkg', version: '1.0.0' }),
      commitMessage: vi.fn().mockReturnValue(undefined),
    };

    vi.doMock('child_process', () => ({
      execFile: (...args) => {
        const cb = args[args.length - 1];
        mockExecSync(...args.slice(0, -1));
        cb(null, '', '');
      },
    }));

    vi.doMock('util', () => ({
      promisify: (fn) => (...args) => new Promise((resolve, reject) => { fn(...args, (err, stdout, stderr) => { if (err) reject(err); else resolve({ stdout, stderr }); }); }),
    }));

    vi.doMock('fs', () => ({
      default: { writeFileSync: mockWriteFileSync, promises: { writeFile: mockWriteFileSync } },
    }));

    vi.doMock('@inquirer/prompts', () => ({
      rawlist: vi.fn(),
      input: vi.fn(),
      Separator: class {},
    }));

    vi.doMock('@availity/workflow-logger', () => ({
      default: {
        info: mockLoggerInfo,
        message: mockLoggerMessage,
        error: mockLoggerError,
        success: mockLoggerSuccess,
        simple: vi.fn(),
        failed: vi.fn(),
      },
    }));

    vi.doMock('yargs', () => ({
      default: () => ({ parseSync: () => mockYargsArgv }),
    }));

    // Lightweight semver mock — avoids loading real semver (OOM prevention)
    vi.doMock('semver', () => ({
      default: {
        valid: (v) => (/^\d+\.\d+\.\d+/.test(v) ? v : null),
        gt: (a, b) => {
          const pa = a.split('.').map(Number);
          const pb = b.split('.').map(Number);
          for (let i = 0; i < 3; i++) {
            if (pa[i] > pb[i]) return true;
            if (pa[i] < pb[i]) return false;
          }
          return false;
        },
        parse: (v) => {
          const [major, minor, patch] = v.split('.').map(Number);
          return { major, minor, patch, prerelease: [] };
        },
        inc: (v, type) => {
          const [major, minor, patch] = v.split('.').map(Number);
          if (type === 'patch') return `${major}.${minor}.${patch + 1}`;
          if (type === 'minor') return `${major}.${minor + 1}.0`;
          if (type === 'major') return `${major + 1}.0.0`;
          return v;
        },
        clean: (v) => v,
      },
    }));

    const mod = await import('../../scripts/version.js');
    tag = mod.default.tag;
    prompt = mod.default.prompt;
    bump = mod.default.bump;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('tag()', () => {
    it('skips git commands when not distribution', async () => {
      await tag(mockSettings);

      expect(mockExecSync).not.toHaveBeenCalled();
      expect(mockLoggerMessage).toHaveBeenCalledWith('Skipping git commands', 'Dry Run');
    });

    it('skips git commands when dry run', async () => {
      mockSettings.isDistribution.mockReturnValue(true);
      mockSettings.isDryRun.mockReturnValue(true);

      await tag(mockSettings);

      expect(mockExecSync).not.toHaveBeenCalled();
    });

    it('runs git add, commit, and tag when distribution and not dry run', async () => {
      mockSettings.isDistribution.mockReturnValue(true);
      mockSettings.isDryRun.mockReturnValue(false);
      mockSettings._version = '2.0.0';

      await tag(mockSettings);

      expect(mockExecSync).toHaveBeenCalledTimes(3);
      expect(mockExecSync.mock.calls[0]).toEqual(['git', ['add', '--all']]);
      expect(mockExecSync.mock.calls[1]).toEqual(['git', ['commit', '-m', 'v2.0.0']]);
      expect(mockExecSync.mock.calls[2]).toEqual(['git', ['tag', '-a', 'v2.0.0', '-m', 'v2.0.0']]);
    });

    it('uses commit message from settings when available', async () => {
      mockSettings.isDistribution.mockReturnValue(true);
      mockSettings.isDryRun.mockReturnValue(false);
      mockSettings._version = '2.0.0';
      mockSettings.commitMessage.mockReturnValue('custom release');

      await tag(mockSettings);

      expect(mockExecSync).toHaveBeenCalledTimes(3);
      expect(mockExecSync.mock.calls[1]).toEqual(['git', ['commit', '-m', 'custom release v2.0.0']]);
      expect(mockExecSync.mock.calls[2]).toEqual(['git', ['tag', '-a', 'custom release v2.0.0', '-m', 'custom release v2.0.0']]);
    });
  });

  describe('bump()', () => {
    it('sets version to ISO date when not distribution', async () => {
      await bump(mockSettings);

      expect(new Date(mockSettings._version).toISOString()).toBe(mockSettings._version);
    });

    it('throws when version is undefined and distribution', async () => {
      mockSettings.isDistribution.mockReturnValue(true);
      mockSettings._version = undefined;

      await expect(bump(mockSettings)).rejects.toThrow('version is undefined');
    });

    it('writes package.json when distribution and not dry run', async () => {
      mockSettings.isDistribution.mockReturnValue(true);
      mockSettings.isDryRun.mockReturnValue(false);
      mockSettings._version = '2.0.0';

      await bump(mockSettings);

      expect(mockWriteFileSync).toHaveBeenCalled();
      const [, contents] = mockWriteFileSync.mock.calls[0];
      const written = JSON.parse(contents);
      expect(written.version).toBe('2.0.0');
    });

    it('skips writing package.json when dry run', async () => {
      mockSettings.isDistribution.mockReturnValue(true);
      mockSettings.isDryRun.mockReturnValue(true);
      mockSettings._version = '2.0.0';

      await bump(mockSettings);

      expect(mockWriteFileSync).not.toHaveBeenCalled();
    });

    it('preserves trailing newline in package.json', async () => {
      mockSettings.isDistribution.mockReturnValue(true);
      mockSettings.isDryRun.mockReturnValue(false);
      mockSettings._version = '2.0.0';

      await bump(mockSettings);

      const [, contents] = mockWriteFileSync.mock.calls[0];
      expect(contents.endsWith('\n')).toBe(true);
    });
  });

  describe('prompt()', () => {
    it('resolves immediately when not distribution', async () => {
      const result = await prompt(mockSettings);
      expect(result).toBe(true);
    });

    it('sets version from valid CLI arg', async () => {
      mockSettings.isDistribution.mockReturnValue(true);

      await prompt(mockSettings, '2.0.0');

      expect(mockSettings._version).toBe('2.0.0');
    });

    it('throws for invalid semver CLI arg', async () => {
      mockSettings.isDistribution.mockReturnValue(true);

      await expect(prompt(mockSettings, 'not-valid')).rejects.toThrow('is not a valid semver version');
    });

    it('throws when CLI version is not greater than current', async () => {
      mockSettings.isDistribution.mockReturnValue(true);

      await expect(prompt(mockSettings, '0.5.0')).rejects.toThrow('must be greater than the current version');
    });
  });
});
