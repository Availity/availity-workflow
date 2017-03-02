const build = require('./build');

function profile() {
  return build({profile: true});
}

module.exports = profile;
