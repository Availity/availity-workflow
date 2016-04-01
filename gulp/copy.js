var context = require('../context');
var copy = require('../dev/copy');

context.gulp.task('av:copy', ['av:copy:templates']);

context.gulp.task('av:copy:templates', function() {
  return copy();
});
