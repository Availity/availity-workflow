var concat = require('gulp-concat');

var context = require('../context');

context.gulp.task('av:concat', ['av:concat:polyfill']);

context.gulp.task('av:concat:polyfill', function() {

  return context.gulp.src(context.settings.polyfill.src)
    .pipe(concat(context.settings.polyfill.name))
    .pipe(context.gulp.dest(context.settings.polyfill.dest));

});
