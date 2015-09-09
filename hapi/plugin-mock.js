var context = require('../context');

function register(server, options, next) {

  server.route({
    path: '/api/{param*}',
    method: 'GET',
    handler: function(request, reply) {

      return reply.proxy({
        host: context.getConfig().servers.web.host,
        port: context.getConfig().servers.web.port,
        protocol: 'http'
      });

    }
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
