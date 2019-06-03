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
  hotLoader: true,

  hotLoaderEntry: /\/App\.jsx?/,

  babelInclude: []

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

const app = {
  title: 'Availity'
};

const testing = {
  browsers: ['Chrome']
};

const globals = {
  __DEV__: false,
  __TEST__: false,
  __PROD__: false,
  __STAGING__: false
};

const mock = {
  // Enables or disables Mock Server
  enabled: true,

  pollyOptions: {
    adapters: ['node-http'],
    persister: 'fs',
    mode: 'replay',
    recordIfMissing: true,
    persisterOptions: {
      fs: {
        recordingsDir: path.join(process.cwd(), 'project/config/recordings')
      }
    },
    matchRequestsBy: {
      order: false, // We can call in any order
      headers: false, // Call as a function to specify include list
      url: {
        hostname: false,
        protocol: false,
        port: false
      }
    }
  }
};

const proxies = [
  {
    // URL context used to match the activation of the proxy per request
    context: ['/api', '/ms'],

    // Host and port number for proxy
    target: `http://localhost:5050`,

    // Enables or disalbe this proxy configuration
    enabled: true,

    logLevel: 'info',

    // Optional.  Rewrites (using regex) the a path before sending request to proxy target.
    pathRewrite: {
      // '^/api': ''
    },

    // Optional.  Send default headers to the proxy destination.
    headers: {
      RemoteUser: 'jsmith'
    }
  }
];

module.exports = {
  development,
  app,
  globals,
  testing,
  mock,
  proxies
};
