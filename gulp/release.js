var bump = require('gulp-bump');
var fs = require('fs');
var path = require('path');
var prompt = require('gulp-prompt');
var semver = require('semver');
var git = require('gulp-git');
var filter = require('gulp-filter');
var tagVersion = require('gulp-tag-version');

var pkg = require('../package.json');

var type = 'patch';

var context = require('../context');

var runSequence = require('run-sequence').use(context.gulp);
context.gulp.task('av:release:sequence', function() {
  runSequence(
    'av:clean',
    'av:lint',
    'av:release:bump',
    ['av:copy', 'av:concat'],
    'av:build:prod',
    'av:release:tag'
    );
});

context.gulp.task('av:release:tag', function() {

  var getPkg = function() {
    var _pkg = JSON.parse(fs.readFileSync(path.join(context.config.project.path, 'package.json'), 'utf8'));
    return _pkg.version;
  };

  return context.gulp.src(['./package.json', './bower.json', './dist/*', 'README.md'])
    .pipe(git.commit('bump package version v' + getPkg())) // commit the changed version number
    .pipe(filter('package.json'))
    .pipe(tagVersion());

});

context.gulp.task('av:release:bump', function() {
  return context.gulp.src(context.config.packages.src)
  .pipe(bump({
    type: type
  }))
  .pipe(context.gulp.dest('./'));
});

context.gulp.task('av:release', function() {

  return context.gulp.src('')
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

      context.gulp.start('release:sequence');

    }));

});
