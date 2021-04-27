const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const readPkg = require('read-pkg');
const rimraf = require('rimraf');
const Logger = require('@availity/workflow-logger');

const asyncExec = promisify(exec);
const reinstallTimeout = 30 * 1000 * 60; // 30 minutes

module.exports = async (cwd) => {
  Logger.info('Upgrading @availity/workflow');
  const pkgFile = path.join(cwd, 'package.json');

  if (fs.existsSync(pkgFile)) {
    // Read Package File to JSON
    const pkg = readPkg.sync({ cwd, normalize: false });
    const { devDependencies, scripts, availityWorkflow } = pkg;
    const pkgLock = path.join(cwd, 'package-lock.json');
    const yarnLock = path.join(cwd, 'yarn.lock');
    let installer = '';
    let peerInfoReceived = false;

    if (fs.existsSync(pkgLock)) {
      // delete package lock, set npm as installer
      Logger.info('Deleting Package-Lock');
      fs.unlinkSync(pkgLock);
      installer = 'npm';
    } else if (fs.existsSync(yarnLock)) {
      // delete yarn lock, set yarn as installer
      Logger.info('Deleting yarn.lock');
      fs.unlinkSync(yarnLock);
      installer = 'yarn';
    } else {
      Logger.warn('No lockfile detected, using yarn as default installer.');
      installer = 'yarn';
    }

    // Add this script into the new workflow scripts for the future
    scripts['upgrade:workflow'] = './node_modules/.bin/upgrade-workflow';

    // Check for deprecated workflow features
    if (availityWorkflow.plugin) {
      Logger.warn(`Deprecated plugin feature detected, removing availityWorkflow.plugin entry.
        If you are not configuring workflow via package.json, please add "availityWorkflow": true, in its place.`);

      delete availityWorkflow.plugin;
    }

    // If workflow entry didn't exist, or plugin was its only key
    if (!availityWorkflow || Object.keys(availityWorkflow).length === 0) {
      Logger.info(`Adding '"availityWorkflow": true' to package.json`);
      Object.assign(pkg, { availityWorkflow: true });
    }

    if (devDependencies) {
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

      // Get needed dependencies from eslint-config-availity
      Logger.info('Adding peerDependencies from eslint-config-availity to devDependencies in project');

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
    }

    // Update package.json
    fs.writeFileSync(pkgFile, `${JSON.stringify(pkg, null, 2)}\n`, 'utf-8');

    Logger.info('Deleting node_modules...');
    // Delete Node Modules
    rimraf.sync(path.join(cwd, 'node_modules'));

    const reinstallNodeModules = async () => {
      Logger.info('Reinstalling packages..');

      // Run install command
      await asyncExec(`${installer} install`, { timeout: reinstallTimeout }, () => {
        Logger.success('\nCongratulations! Welcome to the new @availity/workflow.');
        if (!peerInfoReceived) {
          Logger.warn(
            'To complete your upgrade, please install the peerDependencies from eslint-config-availity as devDependencies in your project.'
          );
        }
      });
    };

    Logger.info('Adding latest versions of @availity/workflow and eslint-config-availity');

    if (installer === 'yarn') {
      // yarn add package will grab the latest version of a package by default
      await asyncExec(
        `${installer} add @availity/workflow eslint-config-availity --dev`,
        { timeout: reinstallTimeout },
        async () => {
          await reinstallNodeModules();
        }
      );
    } else if (installer === 'npm') {
      // npm install package will respect semver if a package is already listed in project
      await asyncExec(
        `${installer} install @availity/workflow@latest eslint-config-availity@latest --save-dev`,
        { timeout: reinstallTimeout },
        async () => {
          await reinstallNodeModules();
        }
      );
    }
  }
};
