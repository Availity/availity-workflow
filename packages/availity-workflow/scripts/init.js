/* eslint-disable import/no-dynamic-require, prefer-promise-reject-errors */
const validateProjectName = require('validate-npm-package-name');
const yargs = require('yargs');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const spawn = require('cross-spawn');
const semver = require('semver');
const os = require('os');
const Logger = require('availity-workflow-logger');

// These files should be allowed to remain on a failed install,
// but then silently removed during the next create.
const errorLogFilePatterns = [
  'npm-debug.log',
];

function printValidationResults(results) {
  if (typeof results !== 'undefined') {
    results.forEach(error => {
      Logger.error(`  *  ${error}`);
    });
  }
}

function checkAppName(appName, package) {
  const validationResult = validateProjectName(appName);
  if (!validationResult.validForNewPackages) {
    Logger.failed(`Could not create a project called "${appName}" because of npm naming restrictions:`);
    printValidationResults(validationResult.errors);
    printValidationResults(validationResult.warnings);
    process.exit(1);
  }

  if (/^availity-workflow/.test(appName) || appName === package) {
    Logger.failed(`We cannot create a project called ${chalk.green(
          appName
        )} because a dependency with the same name exists.
This is due to the way npm works.
Please choose a different project name.`
    );
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
  } catch (err) {
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
      `However, a newly started npm process runs in: ${chalk.bold(
        npmCWD
      )}\n\n` +
      `This is probably caused by a misconfigured system terminal shell.`
  );
  if (process.platform === 'win32') {
    Logger.error(
      `On Windows, this can usually be fixed by running:\n\n` +
      `  ${chalk.cyan(
        'reg'
      )} delete "HKCU\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n` +
      `  ${chalk.cyan(
        'reg'
      )} delete "HKLM\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n\n` +
      `Try to run the above two lines in the terminal.\n` +
      `To learn more about this problem, read: https://blogs.msdn.microsoft.com/oldnewthing/20071121-00/?p=24433/`
    );
  }
  return false;
}

function isSafeToCreateProjectIn(root, name) {
  const validFiles = [
    '.DS_Store',
    'Thumbs.db',
    '.git',
    '.gitignore',
    '.idea',
    'README.md',
    'LICENSE',
    'web.iml',
    '.hg',
    '.hgignore',
    '.hgcheck',
    '.npmignore',
    'mkdocs.yml',
    'docs',
    '.travis.yml',
    '.gitlab-ci.yml',
    '.gitattributes',
  ];
  Logger.empty();

  const conflicts = fs
    .readdirSync(root)
    .filter(file => !validFiles.includes(file))
    // Don't treat log files from previous installation as conflicts
    .filter(
      file => !errorLogFilePatterns.some(pattern => file.indexOf(pattern) === 0)
    );

  if (conflicts.length > 0) {
    Logger.failed(
      `The directory ${chalk.green(name)} contains files that could conflict:`
    );
    Logger.empty();
    conflicts.forEach(file => {
      Logger.error(`  ${file}`);
    });
    Logger.empty();
    Logger.error(
      'Either try using a new directory name, or remove the files listed above.'
    );

    return false;
  }

  // Remove any remnant files from a previous installation
  const currentFiles = fs.readdirSync(path.join(root));
  currentFiles.forEach(file => {
    errorLogFilePatterns.forEach(errorLogFilePattern => {
      // This will catch `(npm-debug|yarn-error|yarn-debug).log*` files
      if (file.indexOf(errorLogFilePattern) === 0) {
        fs.removeSync(path.join(root, file));
      }
    });
  });
  return true;
}

function getInstallPackage(package, version, originalDirectory) {
  let packageToInstall = `availity-workflow-${package}`;
  const validSemver = semver.valid(version);
  if (validSemver || version === 'latest') {
    packageToInstall += `@${validSemver || version}`;
  } else if (version && version.match(/^file:/)) {
    packageToInstall = `file:${path.resolve(
      originalDirectory,
      version.match(/^file:(.*)?$/)[1]
    )}`;
  } else if (version) {
    packageToInstall = version;
  }
  return packageToInstall;
}

// Extract package name from tarball url or path.
function getPackageName(installPackage) {
  if (installPackage.indexOf('git+') === 0) {
    // Pull package name out of git urls e.g:
    // git+https://github.com/mycompany/availity-react-kit.git
    // git+ssh://github.com/mycompany/availity-angular-kit.git#v1.2.3
    return installPackage.match(/([^/]+)\.git(#.*)?$/)[1];
  } else if (installPackage.match(/.+@/)) {
    // Do not match @scope/ when stripping off @version or @tag
    return installPackage.charAt(0) + installPackage.substr(1).split('@')[0];
  } else if (installPackage.match(/^file:/)) {
    const installPackagePath = installPackage.match(/^file:(.*)?$/)[1];
    const installPackageJson = require(path.join(
      installPackagePath,
      'package.json'
    ));
    return installPackageJson.name;
  }
  return installPackage;
}

function checkNodeVersion(packageName) {
  const packageJsonPath = path.resolve(
    process.cwd(),
    'node_modules',
    packageName,
    'package.json'
  );
  const packageJson = require(packageJsonPath);
  if (!packageJson.engines || !packageJson.engines.node) {
    return;
  }

  if (!semver.satisfies(process.version, packageJson.engines.node)) {
    Logger.failed(`You are running Node ${process.version}. ${packageName} requires Node ${packageJson.engines.node} or higher. Please update your version of Node.`);
    process.exit(1);
  }
}

function install(dependencies) {
  return new Promise((resolve, reject) => {
    const args = [
      'install',
      '--save',
      '--save-exact',
      '--loglevel',
      'error',
    ].concat(dependencies);

    const child = spawn('npm', args, { stdio: 'inherit' });
    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `npm ${args.join(' ')}`,
        });
        return;
      }
      resolve();
    });
  });
}

function run(
  root,
  package,
  appName,
  version,
  originalDirectory,
) {
  const packageToInstall = getInstallPackage(package, version, originalDirectory);
  const allDependencies = [packageToInstall];

  Logger.info('Installing packages. This might take a couple of minutes.');
  const packageName = getPackageName(packageToInstall);
  Logger.info(
    `Installing ${chalk.cyan(packageName)}...`
  );
  Logger.empty();

  install(allDependencies)
    .then(() => {
      checkNodeVersion(packageName);

      const scriptsPath = path.resolve(
        process.cwd(),
        'node_modules',
        packageName,
        'scripts',
        'init.js'
      );
      const init = require(scriptsPath);
      return init(root, appName, originalDirectory);
    })
    .catch(reason => {
      Logger.empty();
      Logger.failed('Aborting installation.');
      if (reason.command) {
        Logger.error(`  ${chalk.cyan(reason.command)} has failed.`);
      } else {
        Logger.error(chalk.red('Unexpected error. Please report it as a bug:'));
        Logger.error(reason);
      }
      Logger.empty();

      // On 'exit' we will delete these files from target directory.
      const knownGeneratedFiles = ['package.json', 'package-lock.json', 'node_modules'];
      const currentFiles = fs.readdirSync(path.join(root));
      currentFiles.forEach(file => {
        knownGeneratedFiles.forEach(fileToMatch => {
          // This remove all of knownGeneratedFiles.
          if (file === fileToMatch) {
            Logger.info(`Deleting generated file... ${chalk.cyan(file)}`);
            fs.removeSync(path.join(root, file));
          }
        });
      });
      const remainingFiles = fs.readdirSync(path.join(root));
      if (!remainingFiles.length) {
        // Delete target folder if empty
        Logger.info(
          `Deleting ${chalk.cyan(`${appName}/`)} from ${chalk.cyan(
            path.resolve(root, '..')
          )}`
        );
        process.chdir(path.resolve(root, '..'));
        fs.removeSync(path.join(root));
      }
      Logger.info('Done.');
      process.exit(1);
    });
}


function createApp(name, package, version) {
  const root = path.resolve(name);
  const appName = path.basename(root);

  checkAppName(appName, package);
  fs.ensureDirSync(name);
  if (!isSafeToCreateProjectIn(root, name)) {
    process.exit(1);
  }

  Logger.info(`Creating a new ${chalk.green(`availity-workflow-${package}`)} app in ${chalk.green(root)}.`);
  Logger.empty();

  const packageJson = {
    name: appName,
    version: '0.1.0',
    private: true,
  };
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL
  );

  const originalDirectory = process.cwd();
  process.chdir(root);
  if (!checkThatNpmCanReadCwd()) {
    process.exit(1);
  }

  run(root, package, appName, version, originalDirectory);
}
/* eslint-disable no-unused-expressions */
yargs.command(
  'init <projectName> [options]',
  `${chalk.dim('Initialize your project from scratch.')}`,
  yyargs => {
    yyargs
      .positional('projectName', {
        describe: 'The name of the project you want to create.'
      })
      .version(false)
      .option('package', {
        alias: 'p',
        describe: 'The framework/library availity-workflow package you want to initialize with.',
        default: 'react'
      })
      .option('version', {
        alias: 'v',
        describe: 'Specify which version of the package project you want.',
        default: 'latest'
      })
      .usage(`\nUsage: ${chalk.yellow('av init')} ${chalk.green('<projectName>')} ${chalk.magenta('[options]')}`)
      .example(chalk.yellow(`${chalk.yellow('av init')} ${chalk.green('my-app-name')}`))
      .example(chalk.yellow(`${chalk.yellow('av init')} ${chalk.green('my-app-name')} ${chalk.magenta('-p angular')}`))
  },
  ({projectName, package, version}) => createApp(projectName, package, version)
)
.example(chalk.yellow('av init my-app-name'))
.example(chalk.yellow('av init my-app-name -p angular'))

module.exports = {
  createApp
};