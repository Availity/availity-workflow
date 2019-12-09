const path = require('path');

module.exports = config => {
  config.development.open = '/';

  config.development.hotLoader = {
    enabled: true,
    experimental: true,
  };

  config.modifyWebpackConfig = (webpackConfig, settings) => {
    webpackConfig.resolveLoader.modules.push(path.join(settings.project(), '../node_modules'));
  };

  return config;
};
