const fs = require('fs'); // read/write files
const path = require('path'); // get directory paths
const readPkg = require('read-pkg'); // read package.json correctly
const rimraf = require('rimraf'); // Deleting folder with contents
const exec = require('child_process').exec; // Run npm script from js

module.exports = function(cwd) {
  console.log('Upgrading @availity/workflow to v5.0.0');
  const pkgFile = path.join(cwd, 'package.json');

  if (fs.existsSync(pkgFile)) {
    // Read Package File to JSON
    const pkg = readPkg.sync({ cwd, normalize: false });


    const { devDependencies,scripts } = pkg;

    // Add this script into the new workflow scripts for the future
    scripts['upgrade:workflow'] = "./node_modules/.bin/upgrade-workflow";

    if (devDependencies) {
      console.log('Removing redundant packages...');

      // Delete all deps that were previously required
      delete devDependencies['babel-eslint'];
      delete devDependencies['eslint'];
      delete devDependencies['eslint-config-airbnb'];
      delete devDependencies['eslint-config-airbnb-base'];
      delete devDependencies['eslint-plugin-import'];
      delete devDependencies['eslint-plugin-jsx-a11y'];
      delete devDependencies['eslint-config-prettier'];
      delete devDependencies['eslint-plugin-promise'];
      delete devDependencies['eslint-plugin-react'];
    }

    console.log('Upgrading dependencies');
    // Set the new version of the workflow
    devDependencies['eslint-config-availity'] = '^4.0.0';
    devDependencies['@availity/workflow'] = '^5.0.0';
    devDependencies['@availity/workflow-plugin-react'] = '^5.0.0';

    // Update package.json
    fs.writeFileSync(pkgFile, `${JSON.stringify(pkg, null, 2)}\n`, 'utf-8');

    // delete package lock
    console.log("Deleting Package-Lock");
    fs.unlinkSync(path.join(cwd,'package-lock.json'));

    console.log('Deleting node modules...');
    // Delete Node Modules
    rimraf.sync(path.join(cwd, 'node_modules'));

    console.log('Re-Installing node modules..');
    // Run install command
    exec('npm install',function(){
      console.log("\nCongratulations! Welcome to the new @availity/workflow.")
    });
  }
};
