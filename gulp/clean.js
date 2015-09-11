var context = require('../context');
var del = require('del');

context.gulp.task('av:clean', function() {
  return del.sync([context.settings.dest()]);
});
