const fs = require('fs');
const path = require('path');
const readPkg = require('read-pkg');
const rimraf = require('rimraf');
const { exec } = require('child_process');
const Logger = require('@availity/workflow-logger');

module.exports = (cwd) => {
  Logger.info('Upgrading @availity/workflow');
  const pkgFile = path.join(cwd, 'package.json');

  if (fs.existsSync(pkgFile)) {
    // Read Package File to JSON
    const pkg = readPkg.sync({ cwd, normalize: false });
    const { devDependencies, scripts } = pkg;
    const pkgLock = path.join(cwd, 'package-lock.json');
    const yarnLock = path.join(cwd, 'yarn.lock');
    let installer = '';
    let peerInfoReceived = false;

    if (fs.existsSync(pkgLock)) {
      // delete package lock, set npm install command
      Logger.info('Deleting Package-Lock');
      fs.unlinkSync(pkgLock);
      installer = 'npm';
    } else if (fs.existsSync(yarnLock)) {
      // delete yarn lock, set yarn install command
      Logger.info('Deleting yarn.lock');
      fs.unlinkSync(yarnLock);
      installer = 'yarn';
    } else {
      Logger.warn('No lockfile detected, setting yarn as default installer.');
      installer = 'yarn';
    }

    // Add this script into the new workflow scripts for the future
    scripts['upgrade:workflow'] = './node_modules/.bin/upgrade-workflow';

    if (devDependencies) {
      Logger.info('Removing redundant packages...');

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
      delete devDependencies['@availity/workflow-plugin-react'];
      delete devDependencies['@availity/workflow-plugin-angular'];

      // Get needed dependencies from eslint-config-availity
      Logger.info('Adding peerDependencies from eslint-config-availity to devDependencies');
      exec(`${installer} info eslint-config-availity peerDependencies`, (error, stdout, stderr) => {
        if (!error && !stderr && stdout) {
          // Both npm and yarn will return an object containing key/value pairs of dependencies
          Object.assign(devDependencies, stdout);
          peerInfoReceived = true;
        } else {
          Logger.warn('Failed to get peerDependencies from eslint-config-availity');
        }
      });
    }

    // Update package.json
    fs.writeFileSync(pkgFile, `${JSON.stringify(pkg, null, 2)}\n`, 'utf-8');

    Logger.info('Deleting node modules...');
    // Delete Node Modules
    rimraf.sync(path.join(cwd, 'node_modules'));

    const reinstallNodeModules = () => {
      Logger.info('Reinstalling node modules..');
      // Run install command
      exec(`${installer} install`, () => {
        Logger.success('\nCongratulations! Welcome to the new @availity/workflow.');
        if (!peerInfoReceived) {
          Logger.info(
            'To complete your upgrade, please install the peerDependencies from eslint-config-availity as devDependencies in your project.'
          );
        }
      });
    };

    Logger.info('Adding latest versions of @availity/workflow and eslint-config-availity');

    if (installer === 'yarn') {
      exec(`${installer} add @availity/workflow eslint-config-availity --dev`, () => {
        reinstallNodeModules();
      });
    } else if (installer === 'npm') {
      // installer -i packages --save-dev
      exec(`${installer} install @availity/workflow eslint-config-availity --save-dev`, () => {
        reinstallNodeModules();
      });
    }
  }
};
