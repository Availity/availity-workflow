import build from './build.js';

function profile({ settings }) {
  return build({ profile: true, settings });
}

export default profile;
