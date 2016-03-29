var cpy = require('cpy');
var context = require('../context');

var settings = {
  cwd: context.settings.templates.cwd,
  overwrite: true,
  parents: true
};

function copy() {
  return cpy(context.settings.templates.src, context.settings.dest(), settings);
}

module.exports = copy;
