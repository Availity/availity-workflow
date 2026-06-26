// Shared packages that need transformation in test environments
const baseTransformPackages = ['@av', '@availity', 'axios', '@tanstack', 'is-what', 'copy-anything', 'uuid'];

/**
 * Build a pipe-separated include pattern from babelInclude settings.
 * Used by vitest.config.js.
 */
function buildTransformIncludePattern(settings) {
  const userInclude = settings.configuration.development.babelInclude;
  return [...baseTransformPackages, ...userInclude].join('|');
}

export { buildTransformIncludePattern, baseTransformPackages };
