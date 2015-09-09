var path = require('path');
var file = require('../utils/file');

module.exports = function() {

  var pkg = file(path.join(process.cwd(), 'package.json'), true);
  var bower = file(path.join(process.cwd(), 'bower.json'), true);
  var availity = file(path.join(process.cwd(), 'availity.json'), true);

  var manifests = {
    package: {
      json: JSON.parse(pkg) || {},
      raw: pkg
    },
    bower: {
      json: JSON.parse(bower) || {},
      raw: bower
    },
    availity: {
      json: JSON.parse(availity) || {},
      raw: availity
    }
  };

  return manifests;

};
