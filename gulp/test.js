var context = require('../context');
var testing = require('../dev/test');

context.gulp.task('av:test', ['av:test:ci']);

context.gulp.task('av:test:ci', function() {
  return testing.continous();
});

context.gulp.task('av:test:server', ['av:lint'], function() {
  return testing.debug();
});
