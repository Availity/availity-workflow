var context = require('../context');
var logger = require('../logger');
var build = require('../dev/build');

context.gulp.task('av:build', function() {
  return build();
});

context.gulp.task('av:build:dev', function() {

  logger.error('{red:DEPRECATED. Use av:build task and set the appropriate NODE_ENV variable');

  return context.gulp.start('av:build');

});

context.gulp.task('av:build:prod', function() {

  logger.error('{red:DEPRECATED. Use av:build task and set the appropriate NODE_ENV variable');

  return context.gulp.start('av:build');

});

