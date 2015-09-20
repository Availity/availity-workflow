var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var symbols = require('log-symbols');
var _ = require('lodash');

var webpackConfig = require('../webpack');
var logger = require('../logger');
var context = require('../context');

var started = _.once(function() {
  logger.info('{bold:%s} {green:open browser to %s', symbols.success, context.meta.uri);
});


function register(server, options, next) {

  var compiler = webpack(webpackConfig);

  compiler.plugin('done', function(stats) {
    logger.info('webpack bundle[%s] complete', stats.hash);
    started();
  });


  var webpackDev = webpackMiddleware(compiler, {
    noInfo: true, // display no info to console (only warnings and errors)
    quiet: true, // display nothing to the console
    lazy: false,
    stats: false,
    watchOptions: {
      aggregateTimeout: 1200,
      poll: 1000
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
