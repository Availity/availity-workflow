'use strict';

const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');

const settings = require('../settings');
const webpackConfig = require('../webpack');

const VERSION = require(path.join(process.cwd(), './package.json')).version;

const wpConfig = merge(webpackConfig, {
  devtool: 'cheap-module-source-map',
  cache: false,
  debug: false
});

wpConfig.plugins = [

  // ignore all the moment local files
  new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),

  new webpack.DefinePlugin({
    APP_VERSION: JSON.stringify(VERSION)
  }),

  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    _: 'lodash'
  }),

  // Use bundle name for extracting bundle css
  new ExtractTextPlugin('[name].css', {
    allChunks: true
  })
];

const karmaConfig = {

  basePath: path.join(settings.project(), 'project/app'),

  frameworks: ['jasmine'],

  files: [
    { pattern: 'specs.js', watched: false }
  ],

  reportSlowerThan: 500,

  preprocessors: {
    'specs.js': ['webpack']
  },

  webpack: wpConfig,

  webpackMiddleware: {
    stats: {
      hash: false,
      version: false,
      timings: false,
      assets: false,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
      errors: true,
      errorDetails: true,
      warnings: false,
      publicPath: false
    }
  },

  exclude: [
    '*.less',
    '*.css'
  ],

  client: {
    // log console output in our test console
    captureConsole: true
  },


  reporters: ['spec', 'coverage'],

  port: 9876,

  colors: true,

  autoWatch: false,

  browsers: ['PhantomJS'],

  singleRun: true,

  browserNoActivityTimeout: 60000, // 60 seconds

  // List plugins explicitly, since auto-loading karma-webpack won't work here
  plugins: [
    require('karma-jasmine'),
    require('karma-spec-reporter'),
    require('karma-chrome-launcher'),
    require('karma-coverage'),
    require('karma-webpack-with-fast-source-maps'),
    require('karma-phantomjs-launcher')
  ]
};


// Add coverage statistics if NODE_ENV = testing
if (settings.isTesting()) {

  Object.assign(karmaConfig, {
    coverageReporter: {
      includeAllSources: true,
      dir: settings.coverage(),
      subdir(browser) {
        return browser.toLowerCase().split(/[ /-]/)[0];
      },
      reporters: [
        {
          type: 'text',
          file: 'text.txt'
        },
        {
          type: 'text-summary'
        },
        {
          type: 'html'
        }
      ]
    }
  });

}

module.exports = function(config) {

  config.set(Object.assign({
    logLevel: config.WARN
  }, karmaConfig));

};
