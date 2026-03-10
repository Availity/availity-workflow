import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import Logger from '@availity/workflow-logger';
import { select } from '@inquirer/prompts';
import migrateEslintConfig from './migrate-eslint.js';

const asyncExec = promisify(exec);

const EXEC_TIMEOUT = 30 * 1000 * 60; // 30 minutes
const MAX_BUFFER_SIZE = 1024 * 5000; // 5MB
const execOpts = { timeout: EXEC_TIMEOUT, maxBuffer: MAX_BUFFER_SIZE };

const DEPRECATED_DEPS = [
  'babel-eslint',
  'eslint',
  'eslint-config-airbnb',
  'eslint-config-airbnb-base',
  'eslint-plugin-import',
  'eslint-plugin-jsx-a11y',
  'eslint-config-prettier',
  'eslint-plugin-promise',
  'eslint-plugin-react',
  'availity-workflow',
  'availity-workflow-angular',
  '@availity/workflow-plugin-react',
  '@availity/workflow-plugin-angular',
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
  'jest-environment-jsdom',
];

function detectInstaller(cwd) {
  const hasPkgLock = fs.existsSync(path.join(cwd, 'package-lock.json'));
  const hasYarnLock = fs.existsSync(path.join(cwd, 'yarn.lock'));

  if (hasPkgLock && !hasYarnLock) return 'npm';
  if (hasYarnLock && !hasPkgLock) return 'yarn';
  return null; // ambiguous — caller should prompt
}

async function run(cmd, cwd) {
  Logger.info(`$ ${cmd}`);
  const { stdout, stderr } = await asyncExec(cmd, { ...execOpts, cwd });
  if (stderr) Logger.warn(stderr.trim());
  return stdout.trim();
}

function addDev(installer, packages) {
  const pkgs = packages.join(' ');
  return installer === 'npm'
    ? `npm install --save-dev ${pkgs}`
    : `yarn add --dev ${pkgs}`;
}

function removeDev(installer, packages) {
  const pkgs = packages.join(' ');
  return installer === 'npm'
    ? `npm uninstall ${pkgs}`
    : `yarn remove ${pkgs}`;
}

export default async (cwd) => {
  Logger.info('Upgrading @availity/workflow');
  const pkgFile = path.join(cwd, 'package.json');

  if (!fs.existsSync(pkgFile)) {
    Logger.failed('Could not find package.json');
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));

  // Determine package manager
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
  Logger.info(`Using ${installer} as package manager.`);

  // Remove deprecated deps that are now bundled in workflow/eslint-config
  const depsToRemove = DEPRECATED_DEPS.filter(
    (dep) => pkg.devDependencies?.[dep] || pkg.dependencies?.[dep]
  );
  if (depsToRemove.length > 0) {
    Logger.info('Removing deprecated dependencies...');
    await run(removeDev(installer, depsToRemove), cwd);
  }

  // Upgrade core packages
  Logger.info('Upgrading @availity/workflow and eslint-config-availity to latest...');
  await run(addDev(installer, ['@availity/workflow@latest', 'eslint-config-availity@latest']), cwd);

  // Re-read package.json after package manager updates
  const updatedPkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));

  // Update engines.node
  if (updatedPkg.engines?.node) {
    const oldNode = updatedPkg.engines.node;
    updatedPkg.engines.node = '^20.0.0 || ^22.0.0 || ^24.0.0';
    Logger.info(`Updated engines.node from "${oldNode}" to "${updatedPkg.engines.node}"`);
  }

  // Add upgrade:workflow script
  if (updatedPkg.scripts) {
    updatedPkg.scripts['upgrade:workflow'] = './node_modules/.bin/upgrade-workflow';
  }

  // Clean up deprecated availityWorkflow.plugin
  if (updatedPkg.availityWorkflow?.plugin) {
    Logger.warn('Removing deprecated "availityWorkflow.plugin" from package.json');
    delete updatedPkg.availityWorkflow.plugin;
  }
  if (!updatedPkg.availityWorkflow || Object.keys(updatedPkg.availityWorkflow).length === 0) {
    updatedPkg.availityWorkflow = true;
  }

  // Write non-dependency package.json changes
  fs.writeFileSync(pkgFile, `${JSON.stringify(updatedPkg, null, 2)}\n`, 'utf8');

  // Update Node.js version files if pinned below minimum
  for (const versionFile of ['.nvmrc', '.node-version']) {
    const versionPath = path.join(cwd, versionFile);
    if (fs.existsSync(versionPath)) {
      const current = fs.readFileSync(versionPath, 'utf8').trim();
      const major = Number.parseInt(current, 10);
      if (major && major < 20) {
        fs.writeFileSync(versionPath, '20\n', 'utf8');
        Logger.info(`Updated ${versionFile} from ${current} to 20 (minimum supported version)`);
      }
    }
  }

  // Rename jsconfig.json → tsconfig.json
  const jsconfigPath = path.join(cwd, 'jsconfig.json');
  if (fs.existsSync(jsconfigPath)) {
    fs.renameSync(jsconfigPath, path.join(cwd, 'tsconfig.json'));
    Logger.info('Renamed jsconfig.json → tsconfig.json');
  }

  // Migrate ESLint config to flat config format
  migrateEslintConfig(cwd);

  Logger.success('\nUpgrade complete! Next steps:');
  Logger.info('  1. Run "yarn lint" and review output');
  Logger.info('  2. Run "yarn test" to verify tests pass');
  Logger.info('  3. Run "yarn build" to verify build works');
  Logger.info('  4. Update Dockerfile base images if using Node 18');
  Logger.info('  5. See UPGRADE.md for full details');
};
