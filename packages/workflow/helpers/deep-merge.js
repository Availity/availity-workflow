function isPlainObject(value) {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export default function deepMerge(target, ...sources) {
  for (const source of sources) {
    if (source == null) continue;
    for (const [key, value] of Object.entries(source)) {
      if (value === undefined) continue;
      if (isPlainObject(value) && isPlainObject(target[key])) {
        deepMerge(target[key], value);
      } else {
        target[key] = value;
      }
    }
  }
  return target;
}
