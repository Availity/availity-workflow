var context = require('../context');
var tools = require('../dev/');
var logger = require('../logger');

context.gulp.task('av:lint', ['av:lint:js', 'av:lint:node']);

context.gulp.task('av:lint:js', function lint() {
  return tools.lint();
});

context.gulp.task('av:lint:node', function lint() {
  logger.warn('gulp task [av:lint:node] has been deprecated. Use [av:lint:js]');
});

context.gulp.task('av:complexity', function(done) {
  return tools.complexity()(done);
});
