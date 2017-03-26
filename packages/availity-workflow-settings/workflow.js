const path = require('path');

const development = {

  // Opens the url in the default browser
  open: '',

  // Webpack build status system notifications
  notification: true,

  // Webpack dev server host
  host: 'localhost',

  // Webpack dev server port
  port: 3000,

  // Allows presets to be used for Webpack log levels
  // https://webpack.js.org/configuration/stats/#stats
  logLevel: 'custom',

  sourceMap: 'source-map',

  // Enable hot module replacement for loaders like  style-loader and react-hot-loader
  hot: true,

  // Enable or disable react-hot-loader
  hotLoader: true

  // Allows developers to override the babel-preset-env target to match their developer environment.  This is benefecial if
  // a developer is doing their primary development environment in a browser like Chrome 57+ that already supports a lot
  // of the Es6 thefore not needing to Babelfy code completely.
  //
  // This setting is is only used for development and does not effect staging/production/testing builds which default to IE9.
  //
  // @See https://github.com/babel/babel-preset-env
  // Ex:
  //
  // targets: { ie: 9 }
  // targets: { browsers: ['last 2 Chrome versions'] }

};

const globals = {
  'DEV': null,
  'TEST': null,
  'PROD': null,
  'COVERAGE': null,
  'STAGING': null
};

const ekko = {

  // Enables or disables Ekko
  enabled: true,

  port: 9999,

  // Sets default latency for all route responses
  latency: 250,

  // Folder that contains the mock data files
  data: path.join(process.cwd(), 'project/data'),

  // Path to route configuration file used by Ekko to build Express routes
  routes: path.join(process.cwd(), 'project/config/routes.json'),

  // Array of NPM module names that enhance Ekko with additional data and routes.
  // @See https://github.com/Availity/availity-mock-data
  plugins: [
    'availity-mock-data'
  ],

  // Mock data can be passed a context so that HATEOS links traverse correctly
  pluginContext: `http://localhost:${development.port}/api`
};

const proxies = [
  {

    // URL context used to match the activation of the proxy per request
    context: '/api',

    // Host and port number for proxy
    target: `http://localhost:${ekko.port}`,

    // Enables or disalbe this proxy configuration
    enabled: true,

    logLevel: 'info',

    // Optional.  Rewrites (using regex) the a path before sending request to proxy target.
    pathRewrite: {
      '^/api': ''
    },

    // Optional.  Send default headers to the proxy destination.
    headers: {
      RemoteUser: 'janedoe'
    }
  }

];

module.exports = {

  development,
  globals,
  ekko,
  proxies

};
