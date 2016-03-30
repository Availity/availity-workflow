var utils = require('../utils');

function Config() {
}

var proto = Config.prototype;

proto.extend = function(_webpackConfig) {
  return utils.merge(this.get(), _webpackConfig);
};

proto.get = function() {
  this.webpackConfig = require('./webpack-config');
  return this.webpackConfig;
};

var config = new Config();

module.exports = config;
