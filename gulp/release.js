var del = require('del');

var version = require('./version');
var context = require('../context');

var runSequence = require('run-sequence').use(context.gulp);

context.gulp.task('av:release:sequence', function(cb) {

  del.sync([context.settings.dest()]);

  runSequence(
    context.settings.isProduction() || context.settings.isIntegration() ? 'av:release:prompt' : 'av:noop',
    'av:lint',
    context.settings.isProduction() || context.settings.isIntegration() ? 'av:release:bump' : 'av:noop',
    ['av:copy', 'av:concat'],
    'av:build',
    context.settings.isProduction() || context.settings.isIntegration() ? 'av:release:git' : 'av:noop',
    cb
  );
});

context.gulp.task('av:noop', function() {
  return context.gulp.src('');
});

context.gulp.task('av:release:prompt', function() {
  return version.prompt();
});

context.gulp.task('av:release:git', function() {
  return version.git();
});

context.gulp.task('av:release:bump', function() {
  return version.bump();
});

context.gulp.task('av:release', ['av:release:sequence']);


