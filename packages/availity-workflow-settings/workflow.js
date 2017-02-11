const path = require('path');

module.exports = {

  development: {

    // Opens the url in the default browser
    open: '#',

    // Webpack build status system notifications
    notification: true,

    // Webpack dev server host
    host: '127.0.0.1',

    // Webpack dev server port
    port: 3000,

    // Enable hot reloading server. The behavior for hot reloading depend on
    // the appropriate availity-workflow plugin like availity-workflow-react
    // and availity-workflow-angular.
    hot: true

  },

  ekko: {

    // Sets default latency for all route responses
    latency: 250,

    // Folder that containers the mock data files
    data: path.join(process.cwd(), 'project/data'),

    // Path to route configuration file used by Ekko to build Express routes
    routes: path.join(process.cwd(), 'project/config/routes.json'),

    // Enables or disables Ekko
    enabled: true,

    // Array of NPM module names that enhance Ekko with additional data and routes.
    // @See https://github.com/Availity/availity-mock-data
    plugins: [
      'availity-mock-data'
    ],

    // Mock data can be passed a context used in the HATEOS urls in a response
    pluginContext: 'http://localhost:3000/api'
  },

  proxies: [
    {

      // URL context used to match the activation of the proxy per request
      context: '/api',

      // Host and port number for proxy
      target: 'http://localhost:9999',

      // Enables or disalbe this proxy configuration
      enabled: true,

      // Optional.  Rewrites (using regex) the a path before sending request to proxy target.
      pathRewrite: {
        '^api': ''
      },

      // Optional.  Send default headers to the proxy destination.
      headers: {
        RemoteUser: 'janedoe'
      }
    }

  ]

};
