var version = require('./version');
var lint = require('./lint');

function release() {

  return version.prompt()
   .then(lint)
   .then(version.bump)
   .then(version.tag);

}

module.exports = release;


