import settings from '../settings/index.js';
import baseConfig from '../webpack.config.js';
import prodConfig from '../webpack.config.production.js';
import profileConfig from '../webpack.config.profile.js';
import buildViteConfig from '../vite.config.js';
import buildViteProductionConfig from '../vite.config.production.js';

const NOW = '2023-03-28T16:07:07.909Z';

// Replace absolute paths with a stable placeholder so snapshots don't break across machines
function stabilizePaths(obj) {
  const cwd = process.cwd();
  return JSON.parse(JSON.stringify(obj).replaceAll(cwd, '<ROOT>'));
}

describe('webpack configs', () => {
  beforeAll(async () => {
    vi.spyOn(global.Date.prototype, 'toJSON').mockImplementation(() => NOW);
    await settings.init();
  });

  it('sets up the default config with default settings', () => {
    expect(new Date().toJSON()).toBe(NOW);
    const config = baseConfig(settings);
    expect(stabilizePaths(config)).toMatchSnapshot();
  });

  it('sets up the production config with default settings', () => {
    const config = prodConfig(settings);
    expect(stabilizePaths(config)).toMatchSnapshot();
  });

  it('sets up the profile config with default settings', () => {
    const config = profileConfig(settings);
    expect(stabilizePaths(config)).toMatchSnapshot();
  });
});

describe('vite configs', () => {
  beforeAll(async () => {
    await settings.init();
  });

  it('resolves the vite dev config without ERR_REQUIRE_ESM', async () => {
    const config = await buildViteConfig(settings);
    expect(config).toBeDefined();
    expect(config.root).toBeDefined();
    expect(config.plugins.length).toBeGreaterThan(0);
  });

  it('resolves the vite production config without ERR_REQUIRE_ESM', async () => {
    const config = await buildViteProductionConfig(settings);
    expect(config).toBeDefined();
    expect(config.build).toBeDefined();
  });
});
