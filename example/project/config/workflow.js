const path = require('path');
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
    webpackConfig.resolveLoader.modules.push(path.join(settings.project(), '../node_modules'));
    webpackConfig.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );
  };

  return config;
};
