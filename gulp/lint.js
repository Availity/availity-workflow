var context = require('../context');
var lint = require('../dev/lint');
var complexity = require('../dev/complexity');
var logger = require('../logger');

context.gulp.task('av:lint', ['av:lint:js']);

context.gulp.task('av:lint:js', function() {
  return lint();
});

context.gulp.task('av:lint:node', function() {
  logger.warn('gulp task [av:lint:node] has been deprecated. Use [av:lint:js]');
});

context.gulp.task('av:complexity', function(done) {
  return complexity()(done);
});
