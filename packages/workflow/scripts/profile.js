import build from './build.js';

export default function profile(settings) {
  return build({ profile: true, settings });
}
