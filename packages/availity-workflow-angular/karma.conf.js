
const settings = require('availity-workflow-settings');

const webpackConfig = require('./webpack.config.test');

const karmaConfig = {

  basePath: settings.app(),

  frameworks: ['jasmine'],

  // failOnEmptyTestSuite: false,

  files: [
    { pattern: 'specs-bundle.js', watched: false }
  ],

  reportSlowerThan: 500,

  preprocessors: {
    'specs-bundle.js': ['webpack', 'sourcemap']
  },

  webpack: webpackConfig,

  webpackMiddleware: {
    stats: 'errors-only',
    quiet: true
  },

  exclude: [
    '*.scss',
    '*.css',
    '*.less'
  ],

  client: {
    // log console output in our test console
    captureConsole: true
  },


  reporters: ['spec'],

  port: 9876,

  colors: true,

  autoWatch: false,

  browsers: settings.browsers(),

  singleRun: true,

  browserNoActivityTimeout: 60000, // 60 seconds

  // List plugins explicitly, since auto-loading karma-webpack won't work here
  plugins: [
    require('karma-jasmine'),
    require('karma-spec-reporter'),
    require('karma-coverage'),
    require('karma-chrome-launcher'),
    require('karma-firefox-launcher'),
    require('karma-ie-launcher'),
    require('karma-spec-reporter'),
    require('karma-webpack'),
    require('karma-sourcemap-loader')
  ]
};


// Add coverage statistics if arg --coverage is added from CLI
if (settings.isCoverage()) {

  karmaConfig.reporters = ['progress', 'coverage'];

  karmaConfig.preprocessors = {
    'specs-bundle.js': ['webpack', 'sourcemap', 'coverage']
  };

  Object.assign(karmaConfig, {
    coverageReporter: {
      includeAllSources: true,
      dir: settings.coverage(),
      subdir(browser) {
        return browser.toLowerCase().split(/[ /-]/)[0];
      },
      reporters: [
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
    logLevel: config.LOG_WARN
  }, karmaConfig));

};
