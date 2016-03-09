var _ = require('lodash');
var context = require('../context');


function getSegments(server) {

  var segments = _.map(server.proxies, 'context');
  segments = _.map(segments, function(url) {
    var segs = _.chain(url.split('/')).omitBy(_.isEmpty).values().value();
    return segs[0];
  });

  return segments;
}

function getContextSegments() {

  var servers = context.getConfig().servers;
  var segments = _.map(servers, getSegments);
  segments = _.flatten(segments);
  var contexts = _.uniq(segments);


  return contexts;

}

function getRoutes() {

  var contexts = getContextSegments();

  if (contexts.length === 0) {
    contexts.push('api');
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
