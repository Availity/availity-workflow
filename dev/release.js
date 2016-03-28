var del = require('del');

var context = require('../context');
var version = require('./version');
var lint = require('./lint');
var copy = require('./copy');
var build = require('./build');

function release() {

  del.sync([context.settings.dest()]);

  return version.prompt()
   .then(lint)
   .then(copy)
   .then(build)
   .then(version.bump)
   .then(version.tag);

}

module.exports = release;


