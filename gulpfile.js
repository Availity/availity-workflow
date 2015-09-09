var gulp = require('gulp');
var gulpif = require('gulp-if');
var using = require('gulp-using');
var eslint = require('gulp-eslint');

var context = require('./context');

gulp.task('lint', function() {

  return gulp.src(['!node_modules/**', '**/*.js'])
    .pipe(gulpif(context.settings.verbose, using({
      prefix: 'Task [lint] using'
    })))
    .pipe(eslint('.eslintrc'))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());

});
