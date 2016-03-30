var logger = require('../logger');
var context = require('../context');

context.gulp.task('av:copy', ['av:copy:templates']);

context.gulp.task('av:copy:templates', function(cb) {
  logger.warn('gulp task [av:copy:templates] is being deprecated in availity-workflow v2.');
  cb();
});
