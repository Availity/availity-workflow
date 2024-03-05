import build from './build';

export default function profile(settings) {
  return build({ profile: true, settings });
}
