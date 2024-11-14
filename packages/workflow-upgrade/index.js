const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const readPkg = require('read-pkg');
const rimraf = require('rimraf');
const Logger = require('@availity/workflow-logger');
const inquirer = require('inquirer');

const asyncExec = promisify(exec);

const REINSTALL_TIMEOUT = 30 * 1000 * 60; // 30 minutes
const MAX_BUFFER_SIZE = 1024 * 5000; // 5MB

const reinstallNodeModules = async (installer, peerInfoReceived) => {
  Logger.info('Reinstalling packages..');

  // Run install command
  await asyncExec(`${installer} install`, { timeout: REINSTALL_TIMEOUT, maxBuffer: MAX_BUFFER_SIZE }, () => {
    Logger.success('\nCongratulations! Welcome to the new @availity/workflow.');

    if (!peerInfoReceived) {
      Logger.warn(
        'To complete your upgrade, please install the peerDependencies from eslint-config-availity as devDependencies in your project.'
      );
    }
  });
};

const getLatestNpmVersion = async (pkgName, defaultVersion) => {
  try {
    const { stdout } = await asyncExec(`npm view ${pkgName} version`);
    return stdout.trim();
  } catch {
    Logger.warn(`There was an error getting the latest ${pkgName} version. Defaulting to ${defaultVersion}`);
    return defaultVersion;
  }
};

module.exports = async (cwd) => {
  Logger.info('Upgrading @availity/workflow');
  const pkgFile = path.join(cwd, 'package.json');

  if (fs.existsSync(pkgFile)) {
    // Read Package File to JSON
    Logger.info('Reading package.json...');
    const pkg = readPkg.sync({ cwd, normalize: false });
    const { devDependencies, scripts, availityWorkflow } = pkg;

    const pkgLock = path.join(cwd, 'package-lock.json');
    const yarnLock = path.join(cwd, 'yarn.lock');

    const hasPkgLock = fs.existsSync(pkgLock);
    const hasYarnLock = fs.existsSync(yarnLock);

    let installer = '';
    let peerInfoReceived = false;

    // Determine which pkg manager is used
    Logger.info('Looking for lockfiles to determine which package manager is being used...');
    if (hasPkgLock && hasYarnLock) {
      Logger.warn('We found package-lock.json and yarn.lock files.');
      const response = await inquirer.prompt([
        {
          type: 'list',
          name: 'installer',
          message: 'Which package manager would you like to use? (We recommend yarn)',
          choices: ['yarn', 'npm']
        }
      ]);
      ({ installer } = response);
    } else if (hasPkgLock) {
      Logger.info('package-lock.json detected. Using NPM as installer.');
      installer = 'npm';
    } else if (hasYarnLock) {
      Logger.info('yarn.lock detected. Using Yarn as installer.');
      installer = 'yarn';
    } else {
      Logger.warn('No lockfile detected. Using Yarn as default installer.');
      installer = 'yarn';
    }

    // Get latest verison of packages
    const latestWorkflowVersion = await getLatestNpmVersion('@availity/workflow', '11.1.1');
    const latestEslintVersion = await getLatestNpmVersion('eslint-config-availity', '10.0.1');

    if (devDependencies) {
      Logger.info(`Setting version of @availity/workflow to ${latestWorkflowVersion}`);
      devDependencies['@availity/workflow'] = `^${latestWorkflowVersion}`;

      Logger.info(`Setting version of eslint-config-availity to ${latestEslintVersion}`);
      devDependencies['eslint-config-availity'] = `^${latestEslintVersion}`;

      Logger.info('Removing devDependencies that are no longer needed...');

      // Delete all deps that were previously required
      delete devDependencies['babel-eslint'];
      delete devDependencies.eslint;
      delete devDependencies['eslint-config-airbnb'];
      delete devDependencies['eslint-config-airbnb-base'];
      delete devDependencies['eslint-plugin-import'];
      delete devDependencies['eslint-plugin-jsx-a11y'];
      delete devDependencies['eslint-config-prettier'];
      delete devDependencies['eslint-plugin-promise'];
      delete devDependencies['eslint-plugin-react'];
      delete devDependencies['availity-workflow'];
      delete devDependencies['availity-workflow-angular'];
      delete devDependencies['@availity/workflow-plugin-react'];
      delete devDependencies['@availity/workflow-plugin-angular'];
      delete devDependencies['@typescript-eslint/eslint-plugin'];
      delete devDependencies['@typescript-eslint/parser'];

      // Get needed dependencies from eslint-config-availity
      Logger.info('Adding peerDependencies from eslint-config-availity to devDependencies in project...');

      try {
        const { error, stdout, stderr } = await asyncExec(
          `${installer} info eslint-config-availity peerDependencies --json`
        );
        if (!error && !stderr && stdout) {
          // Both npm and yarn will return an object containing key/value pairs of dependencies
          // npm will return only the peerDependencies object, but yarn nests them inside a data key
          const eslintPkg = JSON.parse(stdout);
          const peerDependencies = installer === 'npm' ? eslintPkg : eslintPkg.data;

          Object.assign(devDependencies, peerDependencies);
          peerInfoReceived = true;
        } else {
          Logger.warn('Failed to get peerDependencies from eslint-config-availity');
        }
      } catch {
        Logger.warn('Failed to get peerDependencies from eslint-config-availity');
      }
    }

    // Add this script into the new workflow scripts for the future
    scripts['upgrade:workflow'] = './node_modules/.bin/upgrade-workflow';

    // Check for deprecated workflow features
    if (availityWorkflow?.plugin) {
      Logger.warn(`Deprecated plugin feature detected. Removing "availityWorkflow.plugin" entry from package.json`);
      delete availityWorkflow.plugin;
    }

    // If workflow entry didn't exist or plugin was its only key
    if (!availityWorkflow || Object.keys(availityWorkflow).length === 0) {
      Logger.info(`Adding '"availityWorkflow": true' to package.json`);
      Object.assign(pkg, { availityWorkflow: true });
    }

    // Update package.json
    Logger.info('Updating package.json...');
    fs.writeFileSync(pkgFile, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');

    // Delete each lockfile in case both exist
    if (hasPkgLock) {
      Logger.info('Deleting package-lock.json...');
      fs.unlinkSync(pkgLock);
    }
    if (hasYarnLock) {
      Logger.info('Deleting yarn.lock...');
      fs.unlinkSync(yarnLock);
    }

    const jsconfigPath = path.join(cwd, 'jsconfig.json');
    const hasJsconfig = fs.existsSync(jsconfigPath);

    if (hasJsconfig) {
      // Copy jsconfig into tsconfig
      const jsconfigData = fs.readFileSync(jsconfigPath);
      fs.writeFileSync(jsconfigData, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');

      // Delete jsconfig
      fs.unlinkSync(jsconfigPath);
    }

    // Delete node_modules
    Logger.info('Deleting node_modules...');
    rimraf.sync(path.join(cwd, 'node_modules'));

    await reinstallNodeModules(installer, peerInfoReceived);
  } else {
    Logger.failed('Could not find package.json');
  }
};
