var open = require('gulp-open');
var _ = require('lodash');

var context = require('../context');
var _url = _.template('http://localhost:<%= port %>/<%= open %>');

context.gulp.task('av:open', function() {
  if (context.getConfig().open) {
    var url = _url({
      port: context.getConfig().servers.web.port,
      open: context.getConfig().open
    });
    context.gulp.src('').pipe(open({uri: url}));
  }
});
