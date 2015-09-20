var context = require('./context');
var cli = require('./cli');
var updateNotifier = require('update-notifier');
var pkg = require('./package.json');

var notifier = updateNotifier({
  pkg: pkg,
  updateCheckInterval: 1000 * 60 * 60 * 24 * 7 // 1 week
});

module.exports.use = function use(_context) {

  notifier.notify();

  context.set(_context || {});

  var requireDir = require('require-dir');

  requireDir('./gulp', {
    recurse: false
  });

};

module.exports.cli = function _cli() {

  notifier.notify();

  return cli;
};
