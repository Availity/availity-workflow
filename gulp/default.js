var del = require('del');
var context = require('../context');

var runSequence = require('run-sequence').use(context.gulp);

context.gulp.task('av:default', function() {

  del.sync([context.settings.dest()]);

  runSequence(
    ['av:copy', 'av:concat'],
    'av:server',
    'av:watch'
    );
});
