var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var using = require('gulp-using');

var context = require('../context');

context.gulp.task('av:concat', ['av:concat:polyfill']);

context.gulp.task('av:concat:polyfill', function() {

  return context.gulp.src(context.settings.polyfill.src)
    .pipe(gulpif(context.settings.args.verbose, using({
      prefix: 'Task [av:concat:polyfill] using'
    })))
    .pipe(concat(context.settings.polyfill.name))
    .pipe(context.gulp.dest(context.settings.polyfill.dest));

});
