var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var _ = require('lodash');

var logger = require('../logger');
var check = require('../dev/check');
var context = require('../context');

function bundle(server, options, next) {

  var statistics = [];
  var webpackConfig = require('../webpack').get();

  var bundleCounts = Object.keys(webpackConfig.entry).length;
  var done = _.after(bundleCounts, function() {
    logger.info(statistics[0]);
    logger.ok('Finished bundling');
    context.emit('av:bundle-complete');
    next();
  });

  logger.info('Started bundling');
  var compiler = webpack(webpackConfig);

  compiler.plugin('done', function(stats) {

    var _stats = stats.toString({
      colors: true,
      cached: true,
      reasons: false,
      source: false,
      chunks: false
    });
    statistics.push(_stats);
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

function register(server, options, next) {

  check().then(function() {
    return bundle(server, options, next);
  })
  .catch(function(err) {
    return next(err);
  });

}

register.attributes = {
  name: 'webpack',
  pkg: require('../package.json')
};

module.exports = register;
