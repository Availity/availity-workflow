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

if (!settings.isDebug()) {

  wpConfig.module.loaders.push({
    test: /\.js$/,
    loader: 'babel-istanbul-loader',
    exclude: /(-spec.js|node_modules|bower_components|specs.js|module.js|vendor.js)/
  });

}

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

module.exports = function(config) {

  config.set({

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
      stats: 'errors-only'
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

    // coverageReporter: {
    //   includeAllSources: true,
    //   dir: settings.coverage(),
    //   subdir(browser) {
    //     return browser.toLowerCase().split(/[ /-]/)[0];
    //   },
    //   reporters: [
    //     {
    //       type: 'text',
    //       file: 'text.txt'
    //     },
    //     {
    //       type: 'text-summary'
    //     },
    //     {
    //       type: 'html'
    //     }
    //   ]
    // },

    port: 9876,

    colors: true,

    logLevel: config.WARN,

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
  });

};
