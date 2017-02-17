require('./vendor');
require('angular-mocks');

/* eslint no-var:0 */
var context = require.context(__dirname, true, /-spec\.js$/);
context.keys().forEach(function(path) {
  try {
    context(path);
  } catch (err) {
    /* eslint no-console:0 */
    console.error('[ERROR] WITH SPEC FILE: ', path);
    console.error(err);
  }
});
