var Promise = require('bluebird');
var gUtil = require('gulp-util');

var logger = require('../logger');
var server = require('../dev/server');
var context = require('../context');

context.gulp.task('av:server', function() {
  return server
    .start()
    .catch(function(reason) {

      throw new gUtil.PluginError({
        plugin: 'av:server',
        message: reason
      });

    });
});

context.gulp.task('av:server:web', function() {
  logger.error('{red:DEPRECATED. Use av:server task');
  return Promise.resolve(true);
});

context.gulp.task('av:server:rest', function() {
  logger.error('{red:DEPRECATED. Use av:server task');
  return Promise.resolve(true);
});
