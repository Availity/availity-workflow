var path = require('path');
var file  = require('./file');

var env = {

  load: function(context) {

    // DEVELOPER CONFIG
    var developerConfig = file(path.join(context.settings.project.path, '/project/config/developer-config'));

    if (!developerConfig) {
      context.meta.developerConfig = false;
    }

    return developerConfig;

  },

  config: function(context) {
    var environment = context.settings.environment;
    return context.settings[environment];
  }

};

module.exports = env;


