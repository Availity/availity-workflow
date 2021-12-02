const path = require('path');

// TODO: add more complex workflow features for building/testing
module.exports = (config) => {
  config.development.open = '/';

  config.development.hotLoader = true;

  config.ekko.enabled = false;

  config.modifyWebpackConfig = (webpackConfig, settings) => {
    webpackConfig.resolveLoader.modules.push(path.join(settings.project(), '../node_modules'));
  };

  return config;
};
