import fs from 'fs';
import path from 'path';
import Logger from '@availity/workflow-logger';
import yaml from 'yaml';

const EXTENDS_MAP = {
  'availity/workflow': { importName: 'workflow', importPath: 'eslint-config-availity/workflow' },
  'availity/browser': { importName: 'browser', importPath: 'eslint-config-availity/browser' },
  'availity/base': { importName: 'base', importPath: 'eslint-config-availity' },
  availity: { importName: 'base', importPath: 'eslint-config-availity' },
};

function readEslintConfig(cwd) {
  const jsonPath = path.join(cwd, '.eslintrc.json');
  const yamlPath = path.join(cwd, '.eslintrc.yaml');
  const ymlPath = path.join(cwd, '.eslintrc.yml');
  const jsPath = path.join(cwd, '.eslintrc.js');

  if (fs.existsSync(jsonPath)) {
    return { config: JSON.parse(fs.readFileSync(jsonPath, 'utf8')), file: jsonPath };
  }
  if (fs.existsSync(yamlPath)) {
    return { config: yaml.parse(fs.readFileSync(yamlPath, 'utf8')), file: yamlPath };
  }
  if (fs.existsSync(ymlPath)) {
    return { config: yaml.parse(fs.readFileSync(ymlPath, 'utf8')), file: ymlPath };
  }
  if (fs.existsSync(jsPath)) {
    Logger.warn('.eslintrc.js detected — manual migration required');
    return null;
  }
  return null;
}

function readEslintIgnore(cwd) {
  const ignorePath = path.join(cwd, '.eslintignore');
  if (!fs.existsSync(ignorePath)) return [];
  return fs
    .readFileSync(ignorePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
}

const SEVERITY_MAP = { 0: 'off', 1: 'warn', 2: 'error' };

function formatRuleValue(value) {
  if (typeof value === 'number' && SEVERITY_MAP[value]) return `'${SEVERITY_MAP[value]}'`;
  if (typeof value === 'string') return `'${value}'`;
  if (Array.isArray(value)) {
    const [severity, ...rest] = value;
    const sev = typeof severity === 'number' && SEVERITY_MAP[severity] ? `'${SEVERITY_MAP[severity]}'` : `'${severity}'`;
    return `[${sev}, ${rest.map((r) => JSON.stringify(r)).join(', ')}]`;
  }
  return JSON.stringify(value);
}

function formatRules(rules) {
  const entries = Object.entries(rules);
  if (entries.length === 0) return '{}';

  const lines = entries.map(([key, value]) => `      '${key}': ${formatRuleValue(value)},`);

  return `{\n${lines.join('\n')}\n    }`;
}

function generateFlatConfig(config, ignorePatterns) {
  const extendsArr = Array.isArray(config.extends) ? config.extends : config.extends ? [config.extends] : [];

  // Build imports
  const imports = [];
  const spreads = [];
  for (const ext of extendsArr) {
    const mapping = EXTENDS_MAP[ext];
    if (mapping) {
      imports.push(`import ${mapping.importName} from '${mapping.importPath}';`);
      spreads.push(`  ...${mapping.importName},`);
    }
  }

  if (imports.length === 0) {
    imports.push("import workflow from 'eslint-config-availity/workflow';");
    spreads.push('  ...workflow,');
  }

  // Build config objects
  const configObjects = [];

  // Rules from project config
  if (config.rules && Object.keys(config.rules).length > 0) {
    configObjects.push(`  {\n    rules: ${formatRules(config.rules)},\n  },`);
  }

  // Overrides → separate config objects
  if (config.overrides) {
    for (const override of config.overrides) {
      const files = Array.isArray(override.files) ? override.files : [override.files];
      const filesStr = files.map((f) => `'${f}'`).join(', ');
      let obj = `  {\n    files: [${filesStr}],`;
      if (override.excludedFiles) {
        const excluded = Array.isArray(override.excludedFiles) ? override.excludedFiles : [override.excludedFiles];
        obj += `\n    ignores: [${excluded.map((f) => `'${f}'`).join(', ')}],`;
      }
      if (override.rules && Object.keys(override.rules).length > 0) {
        obj += `\n    rules: ${formatRules(override.rules)},`;
      }
      obj += '\n  },';
      configObjects.push(obj);
    }
  }

  // Ignores
  if (ignorePatterns.length > 0) {
    const patternsStr = ignorePatterns.map((p) => `'${p}'`).join(', ');
    configObjects.push(`  {\n    ignores: [${patternsStr}],\n  },`);
  }

  return `${imports.join('\n')}\n\nexport default [\n${spreads.join('\n')}\n${configObjects.join('\n')}\n];\n`;
}

export default function migrateEslintConfig(cwd) {
  const flatConfigPath = path.join(cwd, 'eslint.config.js');

  if (fs.existsSync(flatConfigPath)) {
    Logger.info('eslint.config.js already exists — skipping ESLint migration');
    return false;
  }

  const result = readEslintConfig(cwd);
  if (!result) {
    Logger.warn('No .eslintrc config found — skipping ESLint migration');
    return false;
  }

  const { config, file } = result;
  const ignorePatterns = readEslintIgnore(cwd);

  Logger.info('Migrating ESLint config to flat config format...');

  const flatConfig = generateFlatConfig(config, ignorePatterns);
  fs.writeFileSync(flatConfigPath, flatConfig, 'utf8');
  Logger.success(`Created eslint.config.js`);

  // Remove old files
  fs.unlinkSync(file);
  Logger.info(`Removed ${path.basename(file)}`);

  const ignorePath = path.join(cwd, '.eslintignore');
  if (fs.existsSync(ignorePath)) {
    fs.unlinkSync(ignorePath);
    Logger.info('Removed .eslintignore');
  }

  return true;
}
