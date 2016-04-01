var cpy = require('cpy');

var context = require('../context');
var logger = require('../logger');

var settings = {
  cwd: context.settings.templates.cwd,
  overwrite: true,
  parents: true
};

function copy() {
  logger.info('Starting copying templates');
  return cpy(context.settings.templates.src, context.settings.dest(), settings)
    .then(function() {
      logger.ok('Finished copying templates');
    });
}

module.exports = copy;
