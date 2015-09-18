var gulp = require('gulp');
var gulpif = require('gulp-if');
var using = require('gulp-using');
var eslint = require('gulp-eslint');
var fs = require('fs');
var bump = require('gulp-bump');
var prompt = require('gulp-prompt');
var semver = require('semver');
var git = require('gulp-git');
var filter = require('gulp-filter');
var tagVersion = require('gulp-tag-version');
var runSequence = require('run-sequence').use(gulp);

var pkg = require('./package.json');
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

var type = 'patch';

gulp.task('release:sequence', function(cb) {
  runSequence(
    'lint',
    'release:bump',
    'release:tag',
    cb
  );
});

gulp.task('release:tag', function() {

  var getPkg = function() {
    var _pkg = JSON.parse(fs.readFileSync('./package.json'), 'utf8');
    return _pkg.version;
  };

  return gulp.src(['./package.json', 'README.md'])
    .pipe(git.commit('bump package version v' + getPkg())) // commit the changed version number
    .pipe(filter('package.json'))
    .pipe(tagVersion());
});

gulp.task('release:bump', function() {
  return gulp.src(['./package.json'])
    .pipe(bump({ type: type }))
    .pipe(gulp.dest('./'));
});

gulp.task('release', function() {

  return gulp.src('')
    .pipe(prompt.prompt({
      type: 'rawlist',
      name: 'bump',
      message: 'What type of version bump would you like to do ? (current version is ' + pkg.version + ')',
      choices: [
        'patch (' + pkg.version + ' --> ' + semver.inc(pkg.version, 'patch') + ')',
        'minor (' + pkg.version + ' --> ' + semver.inc(pkg.version, 'minor') + ')',
        'major (' + pkg.version + ' --> ' + semver.inc(pkg.version, 'major') + ')',
        'none (exit)'
      ]
    }, function(res) {
      if (res.bump.match(/^patch/)) {
        type = 'patch';
      } else if (res.bump.match(/^minor/)) {
        type = 'minor';
      } else if (res.bump.match(/^major/)) {
        type = 'major';
      }

      gulp.start('release:sequence');

    }));

});

