var context = require('./context');
var cli = require('./cli');

module.exports.use = function use(_context) {

  context.set(_context || {});

  var requireDir = require('require-dir');

  requireDir('./gulp', {
    recurse: false
  });

};

module.exports.cli = function _cli() {
  return cli;
};
