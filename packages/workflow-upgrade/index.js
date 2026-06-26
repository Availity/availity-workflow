#!/usr/bin/env node
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import Logger from '@availity/workflow-logger';
import { select } from '@inquirer/prompts';
import migrateEslintConfig from './migrate-eslint.js';
import migrateWorkflowConfig from './migrate-workflow-config.js';

const asyncExec = promisify(exec);

const EXEC_TIMEOUT = 30 * 1000 * 60; // 30 minutes
const MAX_BUFFER_SIZE = 1024 * 5000; // 5MB
const execOpts = { timeout: EXEC_TIMEOUT, maxBuffer: MAX_BUFFER_SIZE };

const DEPRECATED_DEPS = [
  // Old workflow packages
  'availity-workflow',
  'availity-workflow-angular',
  '@availity/workflow-plugin-react',
  '@availity/workflow-plugin-angular',
  // Babel (esbuild-loader replaces babel)
  '@babel/cli',
  '@babel/core',
  '@babel/preset-env',
  '@babel/preset-react',
  '@babel/preset-typescript',
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-decorators',
  '@babel/plugin-proposal-optional-chaining',
  '@babel/plugin-transform-runtime',
  '@babel/runtime',
  'babel-loader',
  'babel-eslint',
  'babel-jest',
  'babel-plugin-module-resolver',
  // Jest (vitest replaces jest)
  'jest',
  'jest-cli',
  'jest-environment-jsdom',
  'jest-transform-stub',
  'jest-junit',
  'ts-jest',
  '@types/jest',
  'react-test-renderer',
  // Old ESLint packages (eslint-config-availity bundles these)
  'eslint',
  'eslint-config-airbnb',
  'eslint-config-airbnb-base',
  'eslint-plugin-import',
  'eslint-plugin-jsx-a11y',
  'eslint-config-prettier',
  'eslint-plugin-promise',
  'eslint-plugin-react',
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
];

const FILES_TO_REMOVE = [
  'jest.config.js',
  'jest.config.ts',
  'jest.config.mjs',
  'babel.config.js',
  'babel.config.json',
  '.babelrc',
  '.babelrc.js',
  '.babelrc.json',
];

function detectInstaller(cwd) {
  const hasPkgLock = fs.existsSync(path.join(cwd, 'package-lock.json'));
  const hasYarnLock = fs.existsSync(path.join(cwd, 'yarn.lock'));

  if (hasPkgLock && !hasYarnLock) return 'npm';
  if (hasYarnLock && !hasPkgLock) return 'yarn';
  return null;
}

async function run(cmd, cwd) {
  Logger.info(`$ ${cmd}`);
  const { stdout, stderr } = await asyncExec(cmd, { ...execOpts, cwd });
  if (stderr) Logger.warn(stderr.trim());
  return stdout.trim();
}

function addDev(installer, packages) {
  const pkgs = packages.join(' ');
  return installer === 'npm' ? `npm install --save-dev ${pkgs}` : `yarn add --dev ${pkgs}`;
}

function removeDev(installer, packages) {
  const pkgs = packages.join(' ');
  return installer === 'npm' ? `npm uninstall ${pkgs}` : `yarn remove ${pkgs}`;
}

function updateScripts(scripts) {
  if (!scripts) return scripts;

  const updated = { ...scripts };

  // Map old jest/workflow commands to av equivalents
  for (const [key, value] of Object.entries(updated)) {
    if (typeof value !== 'string') continue;

    // jest → av test
    if (['jest', 'jest --coverage', 'npx jest'].includes(value)) {
      updated[key] = key === 'test:coverage' ? 'av test --coverage' : 'av test';
    } else if (value.startsWith('jest ')) {
      // jest --watch → av test --watch
      if (value.includes('--watch')) updated[key] = 'av test --watch';
      else if (value.includes('--coverage')) updated[key] = 'av test --coverage';
      else updated[key] = 'av test';
    }

    // workflow start/build/test/lint → av equivalents
    if (value === 'workflow start' || value === 'npx workflow start') updated[key] = 'av start';
    if (value === 'workflow build' || value === 'npx workflow build') updated[key] = 'av build';
    if (value === 'workflow test' || value === 'npx workflow test') updated[key] = 'av test';
    if (value === 'workflow lint' || value === 'npx workflow lint') updated[key] = 'av lint';
  }

  // Ensure standard scripts exist
  if (!updated.start || updated.start.includes('workflow')) updated.start = 'av start';
  if (!updated.test || updated.test.includes('jest')) updated.test = 'av test';
  if (!updated.lint || updated.lint.includes('workflow')) updated.lint = 'av lint';
  if (!updated.build) updated.build = 'av build';
  if (!updated['build:production']) {
    updated['build:production'] = 'cross-env NODE_ENV=production av build';
  }

  // Add upgrade script
  updated['upgrade:workflow'] = './node_modules/.bin/upgrade-workflow';

  return updated;
}

// eslint-disable-next-line unicorn/no-exports-in-scripts
export { detectInstaller, updateScripts, addDev, removeDev };

// eslint-disable-next-line unicorn/no-exports-in-scripts
export default async (cwd) => {
  Logger.info('Upgrading to @availity/workflow (ESM)\n');
  const pkgFile = path.join(cwd, 'package.json');

  if (!fs.existsSync(pkgFile)) {
    Logger.failed('Could not find package.json');
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));

  // --- Determine package manager ---
  let installer = detectInstaller(cwd);
  if (!installer) {
    Logger.warn('Found both package-lock.json and yarn.lock.');
    installer = await select({
      message: 'Which package manager would you like to use?',
      choices: [
        { name: 'yarn', value: 'yarn' },
        { name: 'npm', value: 'npm' },
      ],
    });
  }
  Logger.info(`Using ${installer}\n`);

  // --- Remove deprecated deps ---
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  const depsToRemove = DEPRECATED_DEPS.filter((dep) => dep in allDeps);
  if (depsToRemove.length > 0) {
    Logger.info('Removing deprecated dependencies...');
    await run(removeDev(installer, depsToRemove), cwd);
  }

  // --- Install latest workflow + eslint-config ---
  Logger.info('\nInstalling @availity/workflow@latest and eslint-config-availity@latest...');
  await run(addDev(installer, ['@availity/workflow@latest', 'eslint-config-availity@latest']), cwd);

  // --- Re-read package.json after installs ---
  const updatedPkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));

  // --- Set "type": "module" for ESM ---
  if (updatedPkg.type !== 'module') {
    updatedPkg.type = 'module';
    Logger.info('Set "type": "module" in package.json');
  }

  // --- Update engines.node ---
  updatedPkg.engines = updatedPkg.engines || {};
  const oldNode = updatedPkg.engines.node;
  updatedPkg.engines.node = '^22.0.0 || ^24.0.0';
  if (oldNode !== updatedPkg.engines.node) {
    Logger.info(`Updated engines.node: "${oldNode || 'unset'}" → "${updatedPkg.engines.node}"`);
  }

  // --- Update scripts ---
  updatedPkg.scripts = updateScripts(updatedPkg.scripts || {});
  Logger.info('Updated scripts to use "av" CLI commands');

  // --- Remove deprecated availityWorkflow.plugin ---
  if (updatedPkg.availityWorkflow?.plugin) {
    delete updatedPkg.availityWorkflow.plugin;
  }
  // Clean availityWorkflow if it's a boolean or empty object
  if (
    updatedPkg.availityWorkflow === true ||
    updatedPkg.availityWorkflow === false ||
    (updatedPkg.availityWorkflow &&
      typeof updatedPkg.availityWorkflow === 'object' &&
      Object.keys(updatedPkg.availityWorkflow).length === 0)
  ) {
    delete updatedPkg.availityWorkflow;
  }

  // --- Write package.json ---
  fs.writeFileSync(pkgFile, `${JSON.stringify(updatedPkg, null, 2)}\n`, 'utf8');

  // --- Update .nvmrc / .node-version ---
  for (const versionFile of ['.nvmrc', '.node-version']) {
    const versionPath = path.join(cwd, versionFile);
    if (fs.existsSync(versionPath)) {
      const current = fs.readFileSync(versionPath, 'utf8').trim();
      const major = Number.parseInt(current, 10);
      if (major && major < 22) {
        fs.writeFileSync(versionPath, '22\n', 'utf8');
        Logger.info(`Updated ${versionFile}: ${current} → 22`);
      }
    }
  }

  // --- Rename jsconfig.json → tsconfig.json ---
  const jsconfigPath = path.join(cwd, 'jsconfig.json');
  if (fs.existsSync(jsconfigPath) && !fs.existsSync(path.join(cwd, 'tsconfig.json'))) {
    fs.renameSync(jsconfigPath, path.join(cwd, 'tsconfig.json'));
    Logger.info('Renamed jsconfig.json → tsconfig.json');
  }

  // --- Update tsconfig.json types for Vitest ---
  const tsconfigPath = path.join(cwd, 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    const types = tsconfig.compilerOptions?.types;
    if (Array.isArray(types)) {
      let changed = false;
      const idx = types.indexOf('jest');
      if (idx !== -1) {
        types.splice(idx, 1);
        changed = true;
      }
      if (!types.includes('vitest/globals')) {
        types.push('vitest/globals');
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(tsconfigPath, `${JSON.stringify(tsconfig, null, 2)}\n`, 'utf8');
        Logger.info('Updated tsconfig.json types: replaced "jest" with "vitest/globals"');
      }
    }
  }

  // --- Remove obsolete config files ---
  for (const file of FILES_TO_REMOVE) {
    const filePath = path.join(cwd, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      Logger.info(`Removed ${file}`);
    }
  }

  // --- Migrate workflow.js CJS → ESM ---
  migrateWorkflowConfig(cwd);

  // --- Migrate ESLint to flat config ---
  migrateEslintConfig(cwd);

  // --- Summary ---
  Logger.success('\n✓ Upgrade complete!\n');
  Logger.info('What changed:');
  Logger.info('  • package.json: "type": "module", updated scripts, engines, deps');
  Logger.info('  • workflow.js: converted to ESM (export default)');
  Logger.info('  • ESLint: migrated to flat config (eslint.config.js)');
  Logger.info('  • Removed: jest, babel, and legacy config files');
  Logger.info('  • Node.js: minimum version is now 22\n');
  Logger.info('Next steps:');
  Logger.info('  1. Review project/config/workflow.js for any remaining require() calls');
  Logger.info('  2. Run "yarn start" to verify the dev server works');
  Logger.info('  3. Run "yarn test" to verify tests pass (now uses Vitest)');
  Logger.info('  4. Run "yarn lint" to check ESLint flat config');
  Logger.info('  5. Update Dockerfile base images to Node 22+');
  Logger.info('  6. Update CI/CD node version references');
};
