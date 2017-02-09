const path = require('path');

module.exports = {

  development: {
    // Opens the url in the default browser
    open: '#',
    // Build status system notifications
    notifications: false,
    host: '127.0.0.1',
    port: 3000
  },

  ekko: {
    host: '127.0.0.1',
    latency: 250,
    port: 9999,
    data: path.join(process.cwd(), 'project/data'),
    routes: path.join(process.cwd(), 'project/config/routes.json'),
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
        RemoteUser: 'janedoe'
      }
    }

  ]

};
