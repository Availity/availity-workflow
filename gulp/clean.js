var context = require('../context');
var del = require('del');

context.gulp.task('av:clean', function() {
  return del([context.settings.dest()]);
});
