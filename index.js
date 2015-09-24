var context = require('./context');
var cli = require('./cli');
var utils = require('./utils');

module.exports.use = function use(_context) {

  utils.notifier();

  context.set(_context || {});

  var requireDir = require('require-dir');

  requireDir('./gulp', {
    recurse: false
  });

};

module.exports.cli = function _cli() {

  return cli;
};
