var webpack = require('webpack');
var gUtil = require('gulp-util');
var _ = require('lodash');

var context = require('../context');
var logger = require('../logger');


context.gulp.task('av:build', function(cb) {

  var webpackConfig = require('../webpack').get();

  var compiler = webpack(webpackConfig);
  var bundleCounts = Object.keys(webpackConfig.entry).length;

  var done = _.after(bundleCounts, function() {
    cb();
  });

  compiler.run(function(err, stats) {

    if (err) {
      throw new gUtil.PluginError('webpack', err);
    }

    var _stats = stats.toString({
      colors: true,
      cached: true,
      reasons: false,
      source: false,
      chunks: false
    });

    gUtil.log('[av:build]', _stats);

    // Webpack will emit stats per entry point bundle created.  Gulp will
    // cry foul if the callback is called multiple times.
    done();

  });

});

context.gulp.task('av:build:dev', function() {

  logger.error('{red:DEPRECATED. Use av:build task and set the appropriate NODE_ENV variable');

  return context.gulp.start('av:build');

});

context.gulp.task('av:build:prod', function() {

  logger.error('{red:DEPRECATED. Use av:build task and set the appropriate NODE_ENV variable');

  return context.gulp.start('av:build');

});

