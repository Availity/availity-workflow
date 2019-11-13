/* eslint-disable unicorn/prefer-string-slice */
/* eslint-disable unicorn/explicit-length-check */
/* eslint-disable global-require */
/* eslint-disable unicorn/prefer-starts-ends-with */
/* eslint-disable unicorn/no-process-exit */
/* eslint-disable import/no-dynamic-require, prefer-promise-reject-errors */
const validateProjectName = require('validate-npm-package-name');
const yargs = require('yargs');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const spawn = require('cross-spawn');
const os = require('os');
const Logger = require('@availity/workflow-logger');
const cloneStarter = require('./clone-starter');

function printValidationResults(results) {
  if (typeof results !== 'undefined') {
    results.forEach(error => {
      Logger.error(`  *  ${error}`);
    });
  }
}

function checkAppName(appName) {
  const validationResult = validateProjectName(appName);
  if (!validationResult.validForNewPackages) {
    Logger.failed(`Could not create a project called "${appName}" because of npm naming restrictions:`);
    printValidationResults(validationResult.errors);
    printValidationResults(validationResult.warnings);

    process.exit(1);
  }

  if (/^@availity\/workflow/.test(appName)) {
    Logger.failed(`We cannot create a project called ${chalk.green(
      appName
    )} because a dependency with the same name exists.
This is due to the way npm works.
Please choose a different project name.`);
    process.exit(1);
  }
}

function checkThatNpmCanReadCwd() {
  const cwd = process.cwd();
  let childOutput = null;
  try {
    // Note: intentionally using spawn over exec since
    // the problem doesn't reproduce otherwise.
    // `npm config list` is the only reliable way I could find
    // to reproduce the wrong path. Just printing process.cwd()
    // in a Node process was not enough.
    childOutput = spawn.sync('npm', ['config', 'list']).output.join('');
  } catch (error) {
    // Something went wrong spawning node.
    // Not great, but it means we can't do this check.
    // We might fail later on, but let's continue.
    return true;
  }
  if (typeof childOutput !== 'string') {
    return true;
  }
  const lines = childOutput.split('\n');
  // `npm config list` output includes the following line:
  // "; cwd = C:\path\to\current\dir" (unquoted)
  // I couldn't find an easier way to get it.
  const prefix = '; cwd = ';
  const line = lines.find(line => line.indexOf(prefix) === 0);
  if (typeof line !== 'string') {
    // Fail gracefully. They could remove it.
    return true;
  }
  const npmCWD = line.substring(prefix.length);
  if (npmCWD === cwd) {
    return true;
  }
  Logger.error(
    `Could not start an npm process in the right directory.\n\n` +
      `The current directory is: ${chalk.bold(cwd)}\n` +
      `However, a newly started npm process runs in: ${chalk.bold(npmCWD)}\n\n` +
      `This is probably caused by a misconfigured system terminal shell.`
  );
  if (process.platform === 'win32') {
    Logger.error(
      `On Windows, this can usually be fixed by running:\n\n` +
        `  ${chalk.cyan('reg')} delete "HKCU\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n` +
        `  ${chalk.cyan('reg')} delete "HKLM\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n\n` +
        `Try to run the above two lines in the terminal.\n` +
        `To learn more about this problem, read: https://blogs.msdn.microsoft.com/oldnewthing/20071121-00/?p=24433/`
    );
  }
  return false;
}

function updatePackageJson({ appName, appPath }) {
  const appPackage = require(path.join(appPath, 'package.json'));

  appPackage.name = appName;
  appPackage.version = '0.1.0';
  appPackage.private = true;

  if (!appPackage.availityWorkflow || !appPackage.availityWorkflow.plugin) {
    throw new Error('Starter Project is not a valid Availity Workflow Project.');
  }
  fs.writeFileSync(path.join(appPath, 'package.json'), JSON.stringify(appPackage, null, 2) + os.EOL);
}

function installDeps(useYarn) {
  Logger.info('Installing dependencies using npm...');
  Logger.empty();

  // Install Depedenciesl
  const proc = spawn.sync(useYarn ? 'yarn' : 'npm', ['install', '--loglevel', 'error'], { stdio: 'inherit' });
  if (proc.status !== 0) {
    Logger.failed('`npm install` failed');
  }
}

async function run({ appPath, appName, originalDirectory, template, useYarn }) {
  try {
    await cloneStarter({
      template,
      appName,
      appPath,
      originalDirectory
    });

    // Update the Package JSON with correct deps and name/versions
    updatePackageJson({
      appName,
      appPath
    });

    // Install Depedencies
    installDeps(useYarn);

    // Display the most elegant way to cd.
    // This needs to handle an undefined originalDirectory for
    // backward compatibility with old global-cli's.
    let cdpath;
    if (originalDirectory && path.join(originalDirectory, appName) === appPath) {
      cdpath = appName;
    } else {
      cdpath = appPath;
    }

    Logger.empty();
    Logger.success(`Success! Created ${appName} at ${appPath}`);
    Logger.info('Inside that directory, you can run several commands:');
    Logger.info();
    Logger.info(chalk.cyan('  npm start'));
    Logger.info('    Starts the development server.');
    Logger.info();
    Logger.info(chalk.cyan('  npm run build'));
    Logger.info('    Bundles the app into static files for production.');
    Logger.info();
    Logger.info(chalk.cyan('  npm test'));
    Logger.info('    Starts the test runner.');
    Logger.info();
    Logger.info('We suggest that you begin by typing:');
    if (originalDirectory !== appPath) {
      Logger.info(chalk.cyan(`  cd ${cdpath}`));
    }
    Logger.info(`  ${chalk.cyan('npm start')}`);
  } catch (error) {
    Logger.empty();
    Logger.failed('Aborting installation.');
    if (error.command) {
      Logger.error(`  ${chalk.cyan(error.command)} has failed.`);
    } else {
      Logger.error(chalk.red('Unexpected error. Please report it as a bug:'));
      Logger.error(error);
    }
    Logger.empty();

    // On 'exit' we will delete these files from target directory.
    const knownGeneratedFiles = ['package.json', 'package-lock.json', 'node_modules'];
    const currentFiles = fs.readdirSync(path.join(appPath));
    currentFiles.forEach(file => {
      knownGeneratedFiles.forEach(fileToMatch => {
        // This remove all of knownGeneratedFiles.
        if (file === fileToMatch) {
          Logger.info(`Deleting generated file... ${chalk.cyan(file)}`);
          fs.removeSync(path.join(appPath, file));
        }
      });
    });
    const remainingFiles = fs.readdirSync(path.join(appPath));
    if (!remainingFiles.length) {
      // Delete target folder if empty
      Logger.info(`Deleting ${chalk.cyan(`${appName}/`)} from ${chalk.cyan(path.resolve(appPath, '..'))}`);
      process.chdir(path.resolve(appPath, '..'));
      fs.removeSync(path.join(appPath));
    }
    Logger.info('Done.');
    process.exit(1);
  }
}

function createApp({ projectName: name, currentDir, template, useYarn }) {
  const appPath = currentDir ? process.cwd() : path.resolve(name);
  const appName = currentDir ? name : path.basename(appPath);

  checkAppName(appName);

  if (!currentDir) {
    fs.ensureDirSync(name);
  }

  Logger.info(`Creating a new Availity app in ${chalk.green(appPath)}.`);
  Logger.empty();

  const originalDirectory = process.cwd();
  process.chdir(appPath);
  if (!checkThatNpmCanReadCwd()) {
    process.exit(1);
  }

  run({ appPath, appName, originalDirectory, template, useYarn });
}
/* eslint-disable no-unused-expressions */
yargs
  .command(
    'init <projectName> [options]',
    `${chalk.dim('Initialize your project from scratch.')}`,
    yyargs => {
      yyargs
        .positional('projectName', {
          describe: 'The name of the project you want to create.'
        })
        .version(false)
        .option('currentDir', {
          alias: 'c',
          describe: 'Pass this if you want to initialize the project in the same folder',
          default: false
        })
        .option('template', {
          alias: 't',
          describe: 'The availity template to initalize the project with. ( Git Repo )',
          default: 'https://github.com/Availity/availity-starter-react'
        })
        .option('useYarn', {
          alias: 'y',
          describe: 'Whether or not to use yarn for install.',
          default: false
        })
        .usage(`\nUsage: ${chalk.yellow('av init')} ${chalk.green('<projectName>')} ${chalk.magenta('[options]')}`)
        .example(chalk.yellow(`${chalk.yellow('av init')} ${chalk.green('my-app-name')}`))
        .example(
          chalk.yellow(`${chalk.yellow('av init')} ${chalk.green('my-app-name')} ${chalk.magenta('-p angular')}`)
        );
    },
    createApp
  )
  .example(chalk.yellow('av init my-app-name'))
  .example(chalk.yellow('av init my-app-name -p angular'));

module.exports = {
  createApp
};
