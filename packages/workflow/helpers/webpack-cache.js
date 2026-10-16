import fs from 'node:fs';
import path from 'node:path';
import paths from './paths.js';

const workflowDir = path.resolve(import.meta.dirname, '..');

/**
 * Builds webpack's persistent (filesystem) `cache` option for a build mode, or returns
 * `undefined` when the user has not opted in. Opt-in is controlled by the `cache` setting
 * in workflow.js:
 *
 *   cache: { development: true, production: true, directory: 'node_modules/.cache/webpack' }
 *
 * Returning `undefined` (instead of `false`) means the `cache` key is omitted from the
 * webpack config entirely, so webpack keeps its default behavior for apps that don't opt in.
 *
 * @param {object} settings - The workflow settings instance
 * @param {'development' | 'production'} mode - Which webpack config is being built.
 *   `production` covers `av build`, staging builds, profile, and `av start --dry-run`.
 * @returns {object | undefined} webpack `cache` option
 */
export default function buildWebpackCache(settings, mode) {
  const cacheSettings = settings.config()?.cache ?? {};
  if (!cacheSettings[mode]) return undefined;

  const cacheDirectory = cacheSettings.directory
    ? path.resolve(paths.project, cacheSettings.directory)
    : path.resolve(paths.appNodeModules, '.cache/webpack');

  // Changing any of these files must bust the cache. webpack hashes their contents, so
  // upgrading @availity/workflow or editing workflow.js invalidates stale entries.
  const config = [path.join(workflowDir, 'webpack.config.js'), path.join(workflowDir, 'webpack.config.production.js')];
  const { workflowConfigPath } = settings;
  if (workflowConfigPath && fs.existsSync(workflowConfigPath)) {
    config.push(workflowConfigPath);
  }

  return {
    type: 'filesystem',
    cacheDirectory,
    // Mode + environment keeps caches separate: `av start --dry-run` builds the production
    // config under NODE_ENV=development, and staging builds differ from production builds.
    name: `${mode}-${settings.environment()}`,
    buildDependencies: { config },
  };
}
