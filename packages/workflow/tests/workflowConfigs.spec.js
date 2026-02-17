import { vi } from 'vitest';

const settings = require('../settings');
const baseConfig = require('../webpack.config');
const prodConfig = require('../webpack.config.production');
const profileConfig = require('../webpack.config.profile');

const NOW = '2023-03-28T16:07:07.909Z';

const normalizePaths = (obj) => {
  const serialized = JSON.stringify(obj, null, 2);
  // Normalize both Unix and Windows absolute paths (non-greedy to handle duplicate folder names)
  return serialized
    .replace(/"\/[^"]+?\/availity-workflow\//g, '"<PROJECT_ROOT>/')
    .replace(/"[A-Z]:\\[^"]+?\\availity-workflow\\/g, '"<PROJECT_ROOT>/');
};

describe('webpack configs', () => {
  beforeAll(async () => {
    vi.spyOn(global.Date.prototype, 'toJSON').mockImplementation(() => NOW);
    await settings.init();
  });

  it('sets up the default config with default settings', () => {
    expect(new Date().toJSON()).toBe(NOW);
    const config = baseConfig(settings);
    expect(normalizePaths(config)).toMatchSnapshot();
  });

  it('sets up the production config with default settings', () => {
    const config = prodConfig(settings);
    expect(normalizePaths(config)).toMatchSnapshot();
  });

  it('sets up the profile config with default settings', () => {
    const config = profileConfig(settings);
    expect(normalizePaths(config)).toMatchSnapshot();
  });
});
