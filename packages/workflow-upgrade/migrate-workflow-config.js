import fs from 'node:fs';
import path from 'node:path';
import Logger from '@availity/workflow-logger';

/**
 * Convert a CJS workflow.js to ESM syntax.
 * Handles:
 *   - const x = require('y') → import x from 'y'
 *   - module.exports = ... → export default ...
 *   - require('x') inline (warns if complex)
 */
function convertToESM(source) {
  let result = source;

  // Convert top-level require statements to imports
  // const x = require('y')  OR  const { a, b } = require('y')
  result = result.replaceAll(
    /^(const|let|var)\s+(.+?)\s*=\s*require\((['"`].*?['"`])\);?\s*$/gm,
    (_, _decl, binding, modPath) => `import ${binding} from ${modPath};`
  );

  // Convert module.exports = (function or object)
  result = result.replace(/^module\.exports\s*=\s*/m, 'export default ');

  return result;
}

/**
 * Remove dead config keys that are no longer functional in v14.
 * - config.eslint = { configType: 'flat' } (flat is the only option)
 * - config.development.jestOverrides with unsupported fields (only collectCoverageFrom,
 *   coveragePathIgnorePatterns, testTimeout are mapped to vitest — all others are dead)
 *
 * NOTE: babelInclude is NOT removed — it still controls which node_modules packages
 * are compiled by esbuild-loader (webpack) and transformed by vitest (deps.inline).
 */
function removeDeadConfigKeys(source) {
  let result = source;

  // Remove config.eslint = { configType: ... };
  result = result.replaceAll(/^\s*config\.eslint\s*=\s*\{[^}]*configType[^}]*\};\s*\n?/gm, '');

  // Add a migration comment above jestOverrides if it contains unsupported keys
  // (moduleNameMapper, transform, transformIgnorePatterns, etc. don't work in vitest compat shim)
  const hasUnsupportedJestOverrides =
    /config\.development\.jestOverrides\s*=/.test(result) &&
    /moduleNameMapper|transform(?!IgnorePatterns)|globals|setupFiles|testEnvironment/.test(result);

  if (hasUnsupportedJestOverrides) {
    // Remove the jestOverrides block since it contains keys the vitest compat shim ignores
    result = result.replaceAll(/^\s*config\.development\.jestOverrides\s*=\s*\{(?:[^{}]|\{[^}]*\})*\};\s*\n?/gm, '');
    // Also remove associated comments
    result = result.replaceAll(/^\s*\/\/.*jestOverrides.*\n/gm, '');
    result = result.replaceAll(/^\s*\/\/.*moduleNameMapper.*\n/gm, '');
    result = result.replaceAll(/^\s*\/\/.*CJS interop.*\n/gm, '');
    result = result.replaceAll(/^\s*\/\/.*__toESM.*\n/gm, '');
  }

  return result;
}

export { convertToESM, removeDeadConfigKeys };

export default function migrateWorkflowConfig(cwd) {
  const workflowPath = path.join(cwd, 'project/config/workflow.js');

  if (!fs.existsSync(workflowPath)) {
    Logger.info('No project/config/workflow.js found — skipping config migration');
    return false;
  }

  let source = fs.readFileSync(workflowPath, 'utf8');
  let changed = false;

  // Remove dead config keys (do this regardless of CJS/ESM)
  const cleaned = removeDeadConfigKeys(source);
  if (cleaned !== source) {
    source = cleaned;
    changed = true;
    Logger.info('Removed dead config keys from workflow.js');
  }

  // Convert CJS → ESM if needed
  if (/\bexport\s+default\b/.test(source) || /^\s*import\s+/m.test(source)) {
    // Already ESM
    if (changed) {
      fs.writeFileSync(workflowPath, source, 'utf8');
    }
    if (!changed) Logger.info('workflow.js is already ESM — skipping conversion');
    return changed;
  }

  if (!source.includes('module.exports') && !source.includes('require(')) {
    if (changed) {
      fs.writeFileSync(workflowPath, source, 'utf8');
    }
    if (!changed) Logger.info('workflow.js has no CJS patterns — skipping conversion');
    return changed;
  }

  Logger.info('Converting workflow.js from CommonJS to ESM...');
  const converted = convertToESM(source);
  fs.writeFileSync(workflowPath, converted, 'utf8');
  Logger.success('Converted workflow.js to ESM (export default)');

  return true;
}
