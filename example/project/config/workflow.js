const path = require('path');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');

// TODO: add more complex workflow features for building/testing
module.exports = (config) => {
  config.development.open = '/';

  config.development.hotLoader = true;

  config.development.stats = {
    level: 'normal',
  };

  config.development.infrastructureLogging = {
    level: 'info',
  };

  config.ekko.enabled = false;

  // specify how to resolve node_modules since yarn hoists them to top-level
  config.modifyWebpackConfig = (webpackConfig, settings) => {
    if (!settings.__UNSAFE_EXPERIMENTAL_USE_RSPACK_DEV()) {
      webpackConfig.resolveLoader.modules.push(path.join(settings.project(), '../node_modules'));
      webpackConfig.resolve.plugins = [new TsConfigPathsPlugin()];
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );
    }
    webpackConfig.resolve.fallback = Object.assign(webpackConfig.resolve.fallback, { url: false, buffer: false });
  };

  return config;
};
