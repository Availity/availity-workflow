// Example workflow config using Vite as the bundler.
// Copy this to project/config/workflow.js to use Vite instead of Webpack.
module.exports = (config) => {
  config.bundler = 'vite';
  // testRunner is auto-set to 'vitest' when bundler is 'vite'

  config.development.open = '/';

  config.ekko.enabled = false;

  // Modify Vite config if needed (equivalent to modifyWebpackConfig)
  config.modifyViteConfig = (viteConfig, settings) => {
    // Example: add custom resolve alias
    // viteConfig.resolve.alias['~'] = settings.app();
    return viteConfig;
  };

  return config;
};
