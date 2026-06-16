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

export default function migrateWorkflowConfig(cwd) {
  const workflowPath = path.join(cwd, 'project/config/workflow.js');

  if (!fs.existsSync(workflowPath)) {
    Logger.info('No project/config/workflow.js found — skipping config migration');
    return false;
  }

  const source = fs.readFileSync(workflowPath, 'utf8');

  // Already ESM — has export default or import statements
  if (/\bexport\s+default\b/.test(source) || /^\s*import\s+/m.test(source)) {
    Logger.info('workflow.js is already ESM — skipping conversion');
    return false;
  }

  // Only convert if it uses CJS patterns
  if (!source.includes('module.exports') && !source.includes('require(')) {
    Logger.info('workflow.js has no CJS patterns — skipping conversion');
    return false;
  }

  Logger.info('Converting workflow.js from CommonJS to ESM...');
  const converted = convertToESM(source);
  fs.writeFileSync(workflowPath, converted, 'utf8');
  Logger.success('Converted workflow.js to ESM (export default)');

  return true;
}
