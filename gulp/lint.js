var glob = require('glob');
var gulpif = require('gulp-if');
var g = require('gulp-util');
var using = require('gulp-using');
var eslint = require('gulp-eslint');

var context = require('../context');

context.gulp.task('av:lint', ['av:lint:js', 'av:lint:node']);

context.gulp.task('av:lint:js', function lint() {
  context.gulp.src(context.settings.js.src)
  .pipe(gulpif(context.settings.args.verbose, using({
    prefix: 'Task [av:lint] using'
  })))
  .pipe(eslint(context.settings.js.linter))
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

context.gulp.task('av:lint:node', function lint() {
  context.gulp.src(context.settings.js.srcNode)
  .pipe(gulpif(context.settings.args.verbose, using({
    prefix: 'Task [av:lint] using'
  })))
  .pipe(eslint(context.settings.js.linterNode))
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

var _plato = function _plato(done) {

  var files = glob.sync(context.settings.js.src);
  var excludeFiles = /.*-spec\.js/;
  var plato = require('plato');

  var options = {
    title: 'Code Complexity Report',
    exclude: excludeFiles
  };

  var outputDir = context.settings.js.reportsDir + '/complexity';

  plato.inspect(files, outputDir, options, function platoCompleted(report) {
    var overview = plato.getOverviewReport(report);
    if (context.settings.args.verbose) {
      g.log(overview.summary);
    }
    if (done) {
      done();
    }
  });
};

context.gulp.task('av:complexity', function(done) {
  _plato(done);
});
