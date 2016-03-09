const path = require('path');
const _ = require('lodash');

const settings = require('./settings');
const config = _.merge({}, settings, {

  development: {
    // open: '/#foo'
    data: path.join(settings.project.path, 'project/data'),
    routes: path.join(settings.project.path, 'project/config/routes.json'),
    servers: {
      app: {
        host: '127.0.0.1',
        port: 3000
      },
      web: {
        host: '127.0.0.1',
        port: 9999
      }
    }
  },

  production: {
    servers: {
      app: {
        host: '127.0.0.1',
        port: 3000
      },
      web: {
        host: '127.0.0.1',
        port: 9999
      }
    },
    data: path.join(settings.project.path, 'project/data'),
    routes: path.join(settings.project.path, 'project/config/routes.json'),
    directory: path.join(__dirname, '/build')
  }

});

module.exports = config;
