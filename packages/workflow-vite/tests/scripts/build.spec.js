// Tests for the opt-in pre-build lint and typecheck in av build (workflow-vite).
// lint() and the TypeScript compiler are mocked so these tests check the wiring:
// whether each step runs, and whether a failure stops the build.

let build;
let mockLint;
let mockRunTypeCheck;
let mockViteBuild;

function makeSettings(buildConfig = {}, overrides = {}) {
  return {
    output: vi.fn(() => '/fake/build'),
    isDryRun: vi.fn(() => false),
    config: vi.fn(() => ({ build: buildConfig })),
    argv: vi.fn(() => ({})),
    ...overrides,
  };
}

beforeEach(async () => {
  vi.resetModules();

  mockLint = vi.fn(async () => true);
  mockRunTypeCheck = vi.fn(async () => undefined);
  mockViteBuild = vi.fn(async () => undefined);

  vi.doMock('node:fs', () => ({
    default: { promises: { rm: vi.fn(async () => undefined) } },
  }));
  vi.doMock('ora', () => ({
    default: vi.fn(() => ({ start: vi.fn(), stop: vi.fn(), color: '' })),
  }));
  vi.doMock('@availity/workflow-logger', () => ({
    default: { info: vi.fn(), success: vi.fn(), failed: vi.fn(), warn: vi.fn(), error: vi.fn() },
  }));
  vi.doMock('../../helpers/apply-modify-vite-config.js', () => ({
    default: (config) => config,
  }));
  vi.doMock('../../vite.config.production.js', () => ({
    default: vi.fn(async () => ({ root: '/fake' })),
  }));
  vi.doMock('vite', () => ({ build: mockViteBuild }));
  vi.doMock('../../scripts/lint.js', () => ({ default: mockLint }));
  vi.doMock('../../scripts/typecheck.js', () => ({ default: mockRunTypeCheck }));

  ({ default: build } = await import('../../scripts/build.js'));
});

afterEach(() => {
  vi.doUnmock('node:fs');
  vi.doUnmock('ora');
  vi.doUnmock('@availity/workflow-logger');
  vi.doUnmock('vite');
  vi.doUnmock('../../scripts/lint.js');
  vi.doUnmock('../../scripts/typecheck.js');
});

describe('av build defaults', () => {
  it('does not lint or typecheck unless opted in', async () => {
    await build({ settings: makeSettings({}) });

    expect(mockLint).not.toHaveBeenCalled();
    expect(mockRunTypeCheck).not.toHaveBeenCalled();
    expect(mockViteBuild).toHaveBeenCalledTimes(1);
  });
});

describe('build.lint', () => {
  it('runs lint before the build when enabled', async () => {
    const settings = makeSettings({ lint: true });
    await build({ settings });

    expect(mockLint).toHaveBeenCalledWith({ settings });
    expect(mockLint.mock.invocationCallOrder[0]).toBeLessThan(mockViteBuild.mock.invocationCallOrder[0]);
  });

  it('does not start the build when lint fails', async () => {
    mockLint.mockRejectedValueOnce(new Error('Failed linting'));

    await expect(build({ settings: makeSettings({ lint: true }) })).rejects.toThrow('Failed linting');
    expect(mockViteBuild).not.toHaveBeenCalled();
  });
});

describe('build.typeCheck', () => {
  it('runs the typecheck before the build when enabled', async () => {
    const settings = makeSettings({ typeCheck: true });
    await build({ settings });

    expect(mockRunTypeCheck).toHaveBeenCalledWith({ settings });
    expect(mockRunTypeCheck.mock.invocationCallOrder[0]).toBeLessThan(mockViteBuild.mock.invocationCallOrder[0]);
  });

  it('does not start the build when the typecheck fails', async () => {
    mockRunTypeCheck.mockRejectedValueOnce(new Error('Type errors found'));

    await expect(build({ settings: makeSettings({ typeCheck: true }) })).rejects.toThrow('Type errors found');
    expect(mockViteBuild).not.toHaveBeenCalled();
  });

  it('runs both lint and typecheck when both are enabled', async () => {
    await build({ settings: makeSettings({ lint: true, typeCheck: true }) });

    expect(mockLint).toHaveBeenCalledTimes(1);
    expect(mockRunTypeCheck).toHaveBeenCalledTimes(1);
  });
});

describe('dry run', () => {
  it('skips lint and typecheck during a dry run', async () => {
    const settings = makeSettings({ lint: true, typeCheck: true }, { isDryRun: vi.fn(() => true) });
    await build({ settings });

    expect(mockLint).not.toHaveBeenCalled();
    expect(mockRunTypeCheck).not.toHaveBeenCalled();
  });
});
