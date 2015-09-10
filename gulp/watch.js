var context = require('../context');

context.gulp.task('av:watch', ['av:watch:templates']);

context.gulp.task('av:watch:templates', function() {
  context.gulp.watch(context.settings.templates.src, ['av:copy:templates']);
});
