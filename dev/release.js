var version = require('./version');
var lint = require('./lint');

module.exports =  function release() {

  return lint()
   .then(version.prompt)
   .then(version.bump)
   .then(version.tag);

};


