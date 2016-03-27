var version = require('./version');
var lint = require('./lint');

module.exports =  function release() {

  return version.prompt
   .then(lint)
   .then(version.bump)
   .then(version.tag);

};


