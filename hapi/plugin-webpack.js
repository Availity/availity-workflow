// https://github.com/SimonDegraeve/hapi-webpack-plugin

var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');

var webpackConfig = require('../webpack');

function register(server, options, next) {

  var compiler = webpack(webpackConfig);
  var webpackDev = webpackMiddleware(compiler, {
    noInfo: false,
    quiet: false,
    stats: {
      colors: true,
      modules: false,
      reasons: false
    }
  });

  // Handle webpackDevMiddleware
  server.ext('onRequest', function _onRequest(request, reply) {

    var req = request.raw.req;
    var res = request.raw.res;

    webpackDev(req, res, function(error) {
      if (error) {
        return reply(error);
      }
      reply.continue();
    });
  });

  return next();
}

register.attributes = {
  name: 'webpack',
  pkg: require('../package.json')
};

module.exports = register;
