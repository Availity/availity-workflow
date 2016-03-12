var del = require('del');
var gUtil = require('gulp-util');

var logger = require('../logger');
var version = require('../dev/version');
var context = require('../context');

var runSequence = require('run-sequence').use(context.gulp);

context.gulp.task('av:release:sequence', function(cb) {

  del.sync([context.settings.dest()]);

  runSequence(
    context.settings.isDistribution() ? 'av:release:prompt' : 'av:noop',
    'av:lint',
    context.settings.isDistribution() ? 'av:release:bump' : 'av:noop',
    ['av:copy', 'av:concat'],
    'av:build',
    context.settings.isDistribution() ? 'av:release:git' : 'av:noop',
    cb
  );
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


