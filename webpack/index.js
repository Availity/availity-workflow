var utils = require('../utils');
var webpackConfig = require('./webpack-config');

function Config(options) {
  utils.merge(this, options);
}

var proto = Config.prototype;

proto.extend = function(options) {
  return utils.merge(new Config(this), options);
};

var config =  new Config(webpackConfig);

module.exports = config;
