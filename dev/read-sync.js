'use strict';

const path = require('path');
const file = require('../utils/file');

module.exports = function() {

  const pkg = file(path.join(process.cwd(), 'package.json'), true);

  const manifests = {
    package: {
      json: JSON.parse(pkg) || {},
      raw: pkg
    }
  };

  return manifests;

};
