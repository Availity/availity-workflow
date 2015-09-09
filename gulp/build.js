var webpack = require('webpack');
var gUtil = require('gulp-util');

var context = require('../context');
var webpackConfig = require('../webpack');

var loaded = false;

function callback(err, stats, cb) {
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

  if (!loaded) {
    cb();
    loaded = true;
  }
}

context.gulp.task('av:build:dev', function(cb) {

  process.env.NODE_ENV = 'development';

  webpack(webpackConfig, function(err, stats) {
    callback(err, stats, cb);
  });
});

context.gulp.task('av:build:prod', function(cb) {

  process.env.NODE_ENV = 'production';

  webpack(webpackConfig, function(err, stats) {
    callback(err, stats, cb);
  });

});

