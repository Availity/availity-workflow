var symbols = require('log-symbols');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var chalk = require('chalk');

var logger = require('../logger');
var file  = require('./file');

var env = {

  load: function(context) {

    // DEVELOPER CONFIG
    var developerConfig = file(path.join(context.settings.project.path, '/project/config/developer-config'));
    if (!developerConfig && (context.settings.isProduction() || context.settings.isDevelopment())) {

      if (!argv.silence) {
        logger.warn(symbols.warning + ' ============================================= ' + symbols.warning);
        logger.warn('Missing ' + chalk.gray('./project/config/developer-config'));
        logger.warn();
        logger.warn('To override the default configuration create');
        logger.warn('a developer.config.js in your project/config folder.');
        logger.warn('-----------------------------------------------');
      }
    }

    return developerConfig;

  },

  config: function(context) {
    var environment = context.settings.environment;
    return context.settings[environment];
  }

};

module.exports = env;


