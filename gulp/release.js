var gUtil = require('gulp-util');

var logger = require('../logger');
var release = require('../dev/release');
var version = require('../dev/version');
var context = require('../context');

context.gulp.task('av:release:sequence', function() {
  return release();
});

context.gulp.task('av:noop', function() {
  return context.gulp.src('');
});

context.gulp.task('av:release:prompt', function() {
  return version.prompt();
});

context.gulp.task('av:release:add', function(cb) {
  logger.warn('gulp task [av:release:add] has been deprecated.  Please use [av:release:tag]');
  cb();
});

context.gulp.task('av:release:tag', function() {
  return version.tag();
});


context.gulp.task('av:release:bump', function() {

  return version
    .bump()
    .catch(function(reason) {

      throw new gUtil.PluginError({
        plugin: 'av:release:bump',
        message: reason
      });

    });

});

context.gulp.task('av:release', ['av:release:sequence']);


