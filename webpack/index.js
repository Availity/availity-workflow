var merge = require('webpack-merge');

var context = require('../context');

function Config() {

}

var proto = Config.prototype;

proto.extend = function(_webpackConfig) {
  return merge(this.get(), _webpackConfig);
};

proto.get = function() {

  this.webpackConfig = require('./webpack-config');

  // Developers should be able to pass in their own Webpack configuration
  // in order to override the defaults (loaders, entry points, etc.)
  //
  // EX:
  //
  //    workflow.use({
  //      gulp: gulp,
  //      wepback: require('./loca/webpack.config')
  //    });
  //
  var externalWebpack = context.webpack || {};

  //
  return merge(this.webpackConfig, externalWebpack);
};

var config = new Config();

module.exports = config;
