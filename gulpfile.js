var eslint = require('eslint');
var globby = require('globby');
var BPromise = require('bluebird');
var gulp = require('gulp');

var version = require('./gulp/version');

var logger = require('./logger');

function lint() {

  var engine = new eslint.CLIEngine({
    useEslintrc: true
  });

  return new BPromise(function(resolve, reject) {

    globby(['**/**.js', '!node_modules/**']).then(function(paths) {

      var report = engine.executeOnFiles(paths.slice(2));
      var formatter = engine.getFormatter();

      if (report.errorCount || report.warningCount) {
        logger.error('eslint');
        logger.log('' + formatter(report.results));
        reject();
      } else {
        logger.log('eslint');
        resolve();
      }

    });

  });

}

gulp.task('release', function(cb) {

  return lint()
    .then(version.prompt)
    .then(version.bump)
    .then(version.git)
    .then(function() {
      cb();
    });

});

