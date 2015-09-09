var path = require('path');
var _ = require('lodash');
var settings = require('./settings');

var config = _.merge({}, settings, {

  development: {
    // open: '/#foo'
    data: path.join(settings.project.path, 'project/data'),
    routes: path.join(settings.project.path, 'project/config/routes.json'),
    servers: {
      app: {
        host: '0.0.0.0',
        port: 3000
      },
      web: {
        host: '0.0.0.0',
        port: 9999
      }
    }
  },

  production: {
    servers: {
      app: {
        host: '0.0.0.0',
        port: 3000
      },
      web: {
        host: '0.0.0.0',
        port: 9999
      }
    },
    data: path.join(settings.project.path, 'project/data'),
    routes: path.join(settings.project.path, 'project/config/routes.json'),
    directory: path.join(__dirname, '/build')
  }

});

module.exports = config;
