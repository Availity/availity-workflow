'use strict';

const path = require('path');

module.exports = {

  development: {
    // Open the browser to specified location when the application starts
    open: '#',
    historyFallback: true,
    // Show notifications on build Webpack build events like success and failure
    notifications: true,
    // Enable hot reloading server. Note that only changes
    // to CSS are currently hot reloaded. JS changes will refresh the browser.
    hot: true,
    host: '127.0.0.1',
    port: 3000
  },

  ekko: {
    host: '127.0.0.1',
    port: 9999,
    data: path.join(__dirname, 'project/data'),
    routes: path.join(__dirname, 'project/config/routes.json'),
    enabled: true,
    plugins: [
      'availity-mock-data'
    ],
    pluginContext: 'http://localhost:3000/api'
  },

  proxies: [
    {
      context: '/api',
      target: 'http://localhost:9999',
      enabled: true,
      pathRewrite: {
        '^api': ''
      },
      headers: {
        RemoteUser: 'jsmith'
      }
    }

  ]

};
