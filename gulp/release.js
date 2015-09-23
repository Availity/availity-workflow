var bump = require('gulp-bump');
var fs = require('fs');
var path = require('path');
var prompt = require('gulp-prompt');
var semver = require('semver');
var git = require('gulp-git');
var del = require('del');
var filter = require('gulp-filter');
var tagVersion = require('gulp-tag-version');

var context = require('../context');

var getPkg = function() {
  var _pkg = JSON.parse(fs.readFileSync(path.join(context.settings.project.path, 'package.json'), 'utf8'));
  return _pkg.version;
};

var type = 'patch';

var runSequence = require('run-sequence').use(context.gulp);

context.gulp.task('av:release:sequence', function(cb) {

  del.sync([context.settings.dest()]);

  runSequence(
    'av:lint',
    context.settings.isProduction() ?  'av:release:bump' : 'av:noop',
    ['av:copy', 'av:concat'],
    'av:build',
    context.settings.isProduction() ?  'av:release:add' : 'av:noop',
    context.settings.isProduction() ?  'av:release:tag' : 'av:noop',
    cb
  );
});

context.gulp.task('av:noop', function() {
  return context.gulp.src('');
});

context.gulp.task('av:release:add', function() {
  return context.gulp.src(path.join(process.cwd(), './dist/'))
    .pipe(git.add({args: '-fA'}));
});

context.gulp.task('av:release:tag', function() {

  return context.gulp.src(['./package.json', './bower.json', './dist/', 'README.md'])
    .pipe(git.commit('bump package version v' + getPkg())) // commit the changed version number
    .pipe(filter('package.json'))
    .pipe(tagVersion());

});

context.gulp.task('av:release:bump', function() {
  return context.gulp.src(context.settings.packages.src)
  .pipe(bump({
    type: type
  }))
  .pipe(context.gulp.dest('./'));
});

context.gulp.task('av:release', function() {

  var version = getPkg();

  if (context.settings.isStaging() || context.settings.isDevelopment()) {
    return context.gulp.start('av:release:sequence');
  }

  return context.gulp.src('')
    .pipe(prompt.prompt({
      type: 'rawlist',
      name: 'bump',
      message: 'What type of version bump would you like to do ? (current version is ' + version + ')',
      choices: [
        'patch (' + version + ' --> ' + semver.inc(version, 'patch') + ')',
        'minor (' + version + ' --> ' + semver.inc(version, 'minor') + ')',
        'major (' + version + ' --> ' + semver.inc(version, 'major') + ')',
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

      context.gulp.start('av:release:sequence');

    }));

});
