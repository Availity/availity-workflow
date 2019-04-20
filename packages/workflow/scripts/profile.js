const build = require('./build');

function profile(settings) {
  return build({ profile: true, settings });
}

module.exports = profile;
