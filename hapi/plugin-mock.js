var _ = require('lodash');
var context = require('../context');


function getSegments(server) {

  var segments =  _.chain(server.proxies)
    .pluck('context')
    .map(function(url) {
      var segs = _.chain(url.split('/')).omit(_.isEmpty).values().value();
      return segs[0];
    })
    .value();

  return segments;
}

function getContextSegments() {

  var servers = context.getConfig().servers;

  var contexts = _.chain(servers)
    .map(getSegments)
    .flatten()
    .unique()
    .value();

  return contexts;

}

function getRoutes() {

  var contexts = getContextSegments();

  if (contexts.length === 0) {
    context.push('api');
  }

  var routes =  _.map(contexts, function(path) {

    var _path = '/' + path + '/{param*}';

    return {
      path: _path,
      method: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
      handler: {
        proxy: {
          host: context.getConfig().servers.web.host,
          port: context.getConfig().servers.web.port,
          passThrough: true
        }
      }
    };

  });

  return routes;

}

function register(server, options, next) {

  var routes = getRoutes();

  _.forEach(routes, function(route) {
    server.route(route);
  });

  // serve static files from dest
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: context.settings.dest(),
        listing: true,
        index: ['index.html']
      }
    }
  });

  next();
}

register.attributes = {
  name: 'mock',
  pkg: require('../package.json')
};

module.exports = register;
