var path = require('path');
var karma = require('karma');

var context = require('../context');

context.gulp.task('av:test', ['av:test:ci']);

context.gulp.task('av:test:ci', function(done) {

  process.env.NODE_ENV = 'testing';

  var server = new karma.Server({
    configFile: path.join(__dirname, '../karma/karma.conf.js')
  }, function(exitStatus) {
    done(exitStatus ? 'Failing unit tests' : undefined);
  });

  server.start();
});

context.gulp.task('av:test:server', ['av:lint'], function(done) {

  process.env.NODE_ENV = 'testing';

  var server = new karma.Server({
    configFile: path.join(__dirname, '../karma/karma.conf.js'),
    browsers: ['Chrome'],
    reporters: ['progress'],
    autoWatch: true,
    singleRun: false
  }, function(exitStatus) {
    done(exitStatus ? 'Failing unit tests' : undefined);
  });

  server.start();
});
