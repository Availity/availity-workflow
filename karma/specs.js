require('angular');
require('angular-mocks');

var context = require.context((process.cwd() + '/project/app'), true, /-spec.js$/ );
context.keys().forEach(context);
