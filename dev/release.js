var del = require('del');

var context = require('../context');
var version = require('./version');
var lint = require('./lint');
var copy = require('./copy');
var build = require('./build');
var logger = require('../logger');

function release() {

  del.sync([context.settings.dest()]);

  return version.prompt()
    .then(function() {
      logger.info('Started releasing');
    })
    .then(lint)
    .then(copy)
    .then(version.bump)
    .then(build)
    .then(version.tag)
    .then(function() {
      logger.ok('Finished releasing');
    })
    .catch(function() {
      logger.fail('Failed releasing');
    });

}

module.exports = release;


