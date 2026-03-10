import fs from 'fs';
import path from 'path';

describe('helpers/paths', () => {
  let paths;

  beforeEach(async () => {
    paths = (await import('../helpers/paths.js')).default;
  });

  it('exports an object with all expected keys', () => {
    expect(paths).toEqual(
      expect.objectContaining({
        project: expect.any(String),
        app: expect.any(String),
        appNodeModules: expect.any(String),
        appStatic: expect.any(String),
        tsconfig: expect.any(String)
      })
    );
  });

  it('all paths are absolute', () => {
    for (const value of Object.values(paths)) {
      expect(path.isAbsolute(value)).toBe(true);
    }
  });

  it('project is the real path of cwd', () => {
    expect(paths.project).toBe(fs.realpathSync(process.cwd()));
  });

  it('app ends with project/app', () => {
    expect(paths.app).toMatch(/project\/app$/);
  });

  it('appNodeModules ends with node_modules', () => {
    expect(paths.appNodeModules).toMatch(/node_modules$/);
  });

  it('appStatic ends with project/app/static', () => {
    expect(paths.appStatic).toMatch(/project\/app\/static$/);
  });

  it('tsconfig ends with tsconfig.json', () => {
    expect(paths.tsconfig).toMatch(/tsconfig\.json$/);
  });
});

describe('helpers/resolve-module', () => {
  let resolveModule;
  let existsSyncMock;

  beforeEach(async () => {
    vi.resetModules();
    vi.doMock('fs', () => ({
      default: { existsSync: vi.fn(() => false) },
      existsSync: vi.fn(() => false)
    }));

    const mockedFs = await import('fs');
    existsSyncMock = mockedFs.default.existsSync;

    resolveModule = (await import('../helpers/resolve-module.js')).default;
  });

  it('returns the .ts path when .ts file exists', () => {
    existsSyncMock.mockImplementation((p) => p === '/app/index.ts');

    const resolveFn = (f) => `/app/${f}`;
    const result = resolveModule(resolveFn, 'index');

    expect(result).toBe('/app/index.ts');
  });

  it('returns the .tsx path when .tsx file exists', () => {
    existsSyncMock.mockImplementation((p) => p === '/app/index.tsx');

    const resolveFn = (f) => `/app/${f}`;
    const result = resolveModule(resolveFn, 'index');

    expect(result).toBe('/app/index.tsx');
  });

  it('falls back to .js when no extension matches', () => {
    existsSyncMock.mockImplementation(() => false);

    const resolveFn = (f) => `/app/${f}`;
    const result = resolveModule(resolveFn, 'index');

    expect(result).toBe('/app/index.js');
  });

  it('tries extensions in order and returns first match', () => {
    existsSyncMock.mockImplementation((p) => p.endsWith('.web.js') || p.endsWith('.ts'));

    const resolveFn = (f) => `/app/${f}`;
    const result = resolveModule(resolveFn, 'index');

    // web.js comes before ts in the extension order, so it should win
    expect(result).toBe('/app/index.web.js');
  });
});
