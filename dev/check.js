// Thanks to https://github.com/ember-cli/ember-cli/blob/master/lib/models/installation-checker.js

var existsSync = require('exists-sync');
var bower = require('bower-directory');
var path = require('path');
var _ = require('lodash');

var utils = require('../utils');
var context = require('../context');
var logger = require('../logger');

function missingBowerDependencies() {
  var directory = bower.sync({cwd: context.settings.project.path});
  return !existsSync(directory);
}

function hasDependencies(pkg) {
  return (pkg.dependencies && _.keys(pkg.dependencies).length > 0) ||
    (pkg.devDependencies && _.keys(pkg.devDependencies).length > 0);
}

function hasBowerDeps() {
  var pkg = utils.file(path.join(context.settings.project.path, 'bower.json'));
  return hasDependencies(pkg);
}

function usingBower() {
  return existsSync(path.join(context.settings.project.path, 'bower.json')) && hasBowerDeps();
}

function check() {

  return new Promise(function(resolve, reject) {

    logger.info('Started bower dependencies check');

    if (usingBower() && missingBowerDependencies()) {
      logger.fail('Bower dependencies not installed. Run `bower install` to install missing dependencies.');
      return reject('Bower dependencies not installed');
    }

    logger.ok('Finished bower dependencies check');

    return resolve(true);

  });

}

module.exports = check;
