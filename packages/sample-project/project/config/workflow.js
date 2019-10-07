const path = require('path');

module.exports = config => {

  config.modifyWebpackConfig = (webpackConfig, settings) => {
    webpackConfig.resolveLoader.modules.push(path.join(settings.project(),"../../node_modules"))
  }

  return config;
}
