var version = require('./version');
var lint = require('./lint');

function release() {

  return lint()
   .then(version.prompt)
   .then(version.bump)
   .then(version.git);

}

release();
