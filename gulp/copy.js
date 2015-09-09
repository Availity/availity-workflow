var changed = require('gulp-changed');
var size = require('gulp-size');

var context = require('../context');

context.gulp.task('av:copy', ['av:copy:templates']);

context.gulp.task('av:copy:templates', function() {

  context.gulp.src(context.settings.templates.src)
    .pipe(changed(context.settings.dest()))
    .pipe(context.gulp.dest(context.settings.dest()))
    .pipe(size({
      showFiles: true,
      title: 'av:copy:templates'
    }));

});
