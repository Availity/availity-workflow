
var webpack = require('webpack');
var path = require('path');
var BowerWebpackPlugin = require('bower-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var context = require('../context');
var webpackConfig = require('../webpack');

var VERSION = require(path.join(process.cwd(), './package.json')).version;

var wpConfig = webpackConfig.extend({
  devtool: 'inline-source-map',
  cache: true,
  debug: true,
  module: {
    postLoaders: [
      {
        test: /\.js$/,
        exclude: /(-spec.js|node_modules|bower_components|specs.js|module.js|vendor.js)/,
        loader: 'istanbul-instrumenter'
      }
    ]
  }
});

if (context.settings.isDebug()) {
  delete wpConfig.module.postLoaders;
}

wpConfig.plugins = [

  // ignore all the moment local files
  new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),

  new BowerWebpackPlugin({
    excludes: [
      /.*\.(less|map)/,
      /glyphicons-.*\.(eot|svg|ttf|woff)/,
      /bootstrap.*\.css/,
      /select2.*\.(png|gif|css)/
    ]
  }),

  new webpack.DefinePlugin({
    APP_VERSION: JSON.stringify(VERSION),
    __DEV__: JSON.stringify(JSON.parse(process.env.NODE_ENV === 'development' || !!process.env.NODE_ENV)),
    __PROD__: JSON.stringify(JSON.parse(process.env.NODE_ENV === 'production')),
    __TEST__: JSON.stringify(JSON.parse(process.env.NODE_ENV === 'test'))
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

    basePath: path.join(context.settings.project.path, 'project/app'),

    frameworks: ['jasmine'],

    files: [
      'specs.js'
    ],

    preprocessors: {
      'specs.js': ['webpack', 'sourcemap']
    },

    webpack: wpConfig,

    webpackMiddleware: {
      noInfo: true
    },

    webpackServer: {
      progress: false,
      stats: false,
      debug: true,
      quiet: false
    },

    exclude: [
      '*.less',
      '*.css'
    ],

    client: {
      // log console output in our test console
      captureConsole: true
    },


    reporters: ['mocha', 'coverage'],

    coverageReporter: {
      includeAllSources: true,
      dir: context.settings.js.reportsDir,
      subdir: function(browser) {
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
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['PhantomJS'],

    singleRun: true,

    browserNoActivityTimeout: 60000, // 60 seconds

    // List plugins explicitly, since auto-loading karma-webpack won't work here
    plugins: [
      require('karma-jasmine'),
      require('karma-mocha-reporter'),
      require('karma-spec-reporter'),
      require('karma-chrome-launcher'),
      require('istanbul-instrumenter-loader'),
      require('karma-firefox-launcher'),
      require('karma-sourcemap-loader'),
      require('karma-coverage'),
      require('karma-webpack'),
      require('karma-phantomjs-launcher')
    ]
  });

};
