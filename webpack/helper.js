var path = require('path');
var context = require('../context');

var utils = {

  maps: function() {
    return context.settings.isDevelopment() ? 'source-map' : 'source-map';
  },

  entry: function() {
    return 'index.js';
  },

  // Don’t use [chunkhash] in development since this will increase compilation time
  // In production, [chunkhash] generate hashes depending on the file contents this if
  // the contents don't change the file could potentially be cached in the browser.
  fileName: function() {
    return context.settings.isDevelopment() ? '[name].js' : '[name]-[chunkhash].js';
  },

  cssFileName: function() {
    return context.settings.isDevelopment() ? '[name].css' : '[name]-[chunkhash].css';
  },

  output: function() {
    return  context.settings.isDistribution() ?
      path.join(context.settings.project.path, 'dist') :
      path.join(context.settings.project.path, 'build');
  }
};

module.exports = utils;
