// DO NOT MODIFY OR DELETE THIS FILE
require('angular');
require('angular-mocks');

Error.stackTraceLimit = Infinity;

// DO NOT DELETE OR MODIFY THIS FILE ;)

/* eslint no-var:0 */
var tests = require.context(__dirname, true, /[-|\.]spec\.js$/);
tests.keys().forEach(function(path) {
  try {
    tests(path);
  } catch (err) {
    /* eslint no-console:0 */
    console.error('Error in ' + path);
    console.error(err);
  }
});

const components = require.context(__dirname, true, /index\.js$/);
components.keys().forEach(components);

