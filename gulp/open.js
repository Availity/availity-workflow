var context = require('../context');
var open = require('../dev/open');

context.gulp.task('av:open', function() {
  return open();
});
