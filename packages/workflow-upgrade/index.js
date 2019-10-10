const fs = require('fs');
const path = require('path');
const readPkg = require('read-pkg');
const rimraf = require('rimraf');
const { exec } = require('child_process');
const Logger = require('@availity/workflow-logger');

module.exports = cwd => {
  Logger.info('Upgrading @availity/workflow to v7.0.0');
  const pkgFile = path.join(cwd, 'package.json');

  if (fs.existsSync(pkgFile)) {
    // Read Package File to JSON
    const pkg = readPkg.sync({ cwd, normalize: false });

    const { devDependencies, scripts } = pkg;

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
    }

    Logger.info('Upgrading dependencies');
    // Set the new version of the workflow
    devDependencies['eslint-config-availity'] = '^5.2.0';
    devDependencies['@availity/workflow'] = '^7.0.0';

    // Update package.json
    fs.writeFileSync(pkgFile, `${JSON.stringify(pkg, null, 2)}\n`, 'utf-8');

    // delete package lock
    Logger.info('Deleting Package-Lock');
    fs.unlinkSync(path.join(cwd, 'package-lock.json'));

    Logger.info('Deleting node modules...');
    // Delete Node Modules
    rimraf.sync(path.join(cwd, 'node_modules'));

    Logger.info('Re-Installing node modules..');
    // Run install command
    exec('npm install', () => {
      Logger.success('\nCongratulations! Welcome to the new @availity/workflow.');
    });
  }
};
