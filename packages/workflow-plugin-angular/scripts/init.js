/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require, prefer-promise-reject-errors */
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const os = require('os');
const Logger = require('@availity/workflow-logger');

module.exports = function init(
  appPath,
  appName,
  originalDirectory
) {
  const ownPackageName = require(path.join(__dirname, '..', 'package.json'))
    .name;
  const ownPath = path.join(appPath, 'node_modules', ownPackageName);

  const readmeExists = fs.existsSync(path.join(appPath, 'README.md'));
  if (readmeExists) {
    fs.renameSync(
      path.join(appPath, 'README.md'),
      path.join(appPath, 'README.old.md')
    );
  }

  // Copy the files for the user
  const templatePath = path.join(ownPath, 'template');
  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, appPath);
  } else {
    Logger.failed(
      `Could not locate supplied template: ${chalk.green(templatePath)}`
    );
    return;
  }

  fs.renameSync(
    path.join(appPath, 'gitignore'),
    path.join(appPath, '.gitignore')
  );

  const appPackage = require(path.join(appPath, 'package.json'));

  appPackage.name = appName;
  appPackage.version = "0.1.0";
  appPackage.private = true;

  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2) + os.EOL
  );

  Logger.info('Installing dependencies using npm...');
  Logger.empty()

  const proc = spawn.sync('npm', ['install', '--loglevel', 'error'], { stdio: 'inherit' });
  if (proc.status !== 0) {
    Logger.failed('`npm install` failed');
    return;
  }

  // Display the most elegant way to cd.
  // This needs to handle an undefined originalDirectory for
  // backward compatibility with old global-cli's.
  let cdpath;
  if (originalDirectory && path.join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }

  Logger.empty()
  Logger.success(`Success! Created ${appName} at ${appPath}`);
  Logger.info('Inside that directory, you can run several commands:');
  Logger.info()
  Logger.info(chalk.cyan('  npm start'));
  Logger.info('    Starts the development server.');
  Logger.info()
  Logger.info(chalk.cyan('  npm run build'));
  Logger.info('    Bundles the app into static files for production.');
  Logger.info()
  Logger.info(chalk.cyan('  npm test'));
  Logger.info('    Starts the test runner.');
  Logger.info()
  Logger.info('We suggest that you begin by typing:');
  if(originalDirectory !== appPath) {
    Logger.info(chalk.cyan(`  cd ${cdpath}`));
  }
  Logger.info(`  ${chalk.cyan('npm start')}`);
};
