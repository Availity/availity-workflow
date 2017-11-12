const settings = require('availity-workflow-settings');

const webpackConfig = require('./webpack.config.test');

if (settings.isCoverage()) {
  webpackConfig.module.rules.push({
    test: /\.js$/,
    include: settings.app(),
    exclude: [/node_modules/, /[-|\.]spec\.js$/, /specs\-bundle\.js/],
    enforce: 'post',
    loader: 'istanbul-instrumenter-loader',
    options: { esModules: true },
  });
}

const karmaConfig = {
  basePath: settings.app(),

  frameworks: ['jasmine'],

  files: [{ pattern: 'specs-bundle.js', watched: false }],

  reportSlowerThan: 500,

  preprocessors: {
    'specs-bundle.js': ['webpack', 'sourcemap'],
  },

  webpack: webpackConfig,

  webpackMiddleware: {
    stats: 'errors-only',
    quiet: true,
  },

  exclude: ['*.scss', '*.css', '*.less'],

  client: {
    // log console output in our test console
    captureConsole: true,
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
    require('karma-coverage-istanbul-reporter'),
    require('karma-chrome-launcher'),
    require('karma-firefox-launcher'),
    require('karma-ie-launcher'),
    require('karma-spec-reporter'),
    require('karma-webpack'),
    require('karma-sourcemap-loader'),
  ],
};

// Add coverage statistics if arg --coverage is added from CLI
if (settings.isCoverage()) {
  karmaConfig.reporters.push('coverage-istanbul');

  Object.assign(karmaConfig, {
    coverageIstanbulReporter: {
      fixWebpackSourcePaths: true,
      dir: settings.coverage(),
      subdir(browser) {
        return browser.toLowerCase().split(/[ /-]/)[0];
      },
      reports: ['html', 'text-summary'],
    },
  });
}

module.exports = function(config) {
  config.set(
    Object.assign(
      {
        logLevel: config.LOG_INFO,
      },
      karmaConfig
    )
  );
};
