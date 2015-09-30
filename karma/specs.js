
module.parent.require('./project/app/vendor');
module.parent.require('angular-mocks');

// require all SPEC files
var textContext = require.context((process.cwd() + '/project/app'), true, /-spec.js$/ );
textContext.keys().forEach(textContext);

// require all SOURCE files
var sourceContext = require.context((process.cwd() + '/project/app'), true, /index\.js$/);
sourceContext.keys().forEach(sourceContext);


