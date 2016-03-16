var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var _ = require('lodash');

var webpackConfig = require('../webpack');
var logger = require('../logger');

function register(server, options, next) {

  var bundleCounts = Object.keys(webpackConfig.entry).length;
  var done = _.after(bundleCounts, function() {
    next();
  });

  var compiler = webpack(webpackConfig);

  compiler.plugin('done', function(stats) {
    logger.info('webpack bundle[%s] complete', stats.hash);
    done();
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
}

register.attributes = {
  name: 'webpack',
  pkg: require('../package.json')
};

module.exports = register;
