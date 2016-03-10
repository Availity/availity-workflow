var del = require('del');

var version = require('./version');
var context = require('../context');

var runSequence = require('run-sequence').use(context.gulp);

context.gulp.task('av:release:sequence', function(cb) {

  del.sync([context.settings.dest()]);

  runSequence(
    'av:lint',
    context.settings.isProduction() ?  'av:release:bump' : 'av:noop',
    ['av:copy', 'av:concat'],
    'av:build',
    context.settings.isProduction() ?  'av:release:git' : 'av:noop',
    cb
  );
});

context.gulp.task('av:noop', function() {
  return context.gulp.src('');
});

context.gulp.task('av:release:git', function() {
  return version.git();
});

context.gulp.task('av:release:add', function() {
  return context.gulp.src('');  // deprecated
});

context.gulp.task('av:release:tag', function() {
  return context.gulp.src(''); // deprecated
});

context.gulp.task('av:release:bump', function() {
  return version.bump();
});

context.gulp.task('av:release', function() {

  if (context.settings.isStaging() || context.settings.isDevelopment()) {
    return context.gulp.start('av:release:sequence');
  }

  return version.release();

});


