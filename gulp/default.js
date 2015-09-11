var context = require('../context');

var runSequence = require('run-sequence').use(context.gulp);

context.gulp.task('av:default', function(cb) {
  runSequence(
    'av:clean',
    ['av:copy', 'av:concat'],
    'av:server',
    'av:watch'
    );
  cb();
});
