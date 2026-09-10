/* eslint-disable unicorn/no-process-exit */
import validateProjectName from 'validate-npm-package-name';
import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import Logger from '@availity/workflow-logger';
import cloneStarter from './clone-starter.js';

function printValidationResults(results) {
  if (results !== undefined) {
    for (const error of results) {
      Logger.error(`  *  ${error}`);
    }
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

function checkThatWeCanReadCwd(installer) {
  const cwd = process.cwd();
  let childOutput = null;
  try {
    // Note: intentionally using spawn over exec since
    // the problem doesn't reproduce otherwise.
    // `npm config list` is the only reliable way I could find
    // to reproduce the wrong path. Just printing process.cwd()
    // in a Node process was not enough.
    childOutput = spawnSync(installer, ['config', 'list'], { shell: true }).output.join('');
  } catch {
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
  const line = lines.find((line) => line.indexOf(prefix) === 0);
  if (typeof line !== 'string') {
    // Fail gracefully. They could remove it.
    return true;
  }
  const npmCWD = line.slice(prefix.length);
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
  const appPackage = JSON.parse(fs.readFileSync(path.join(appPath, 'package.json'), 'utf8'));

  appPackage.name = appName;
  appPackage.version = '0.1.0';
  appPackage.private = true;

  fs.writeFileSync(path.join(appPath, 'package.json'), JSON.stringify(appPackage, null, 2) + os.EOL);
}

const NPM = 'npm';
const YARN = 'yarn';

function detectInstaller(appPath, defaultInstaller) {
  // If the caller explicitly requested npm, honour that.
  if (defaultInstaller === NPM) return NPM;

  // Check for a .yarnrc.yml with a yarnPath entry. When present, the repo
  // bundles its own Yarn release (e.g. Yarn 4 Berry). Invoke that directly
  // via `node` rather than relying on whatever global yarn binary is on the
  // machine — this avoids both Yarn 1 / Yarn 4 mismatches and the need for
  // Corepack to be enabled.
  try {
    const yarnrc = fs.readFileSync(path.join(appPath, '.yarnrc.yml'), 'utf8');
    const match = yarnrc.match(/^yarnPath:\s*(.+)$/m);
    if (match) {
      const yarnRelativePath = match[1].trim().replaceAll(/^['"]|['"]$/g, '');
      const yarnAbsPath = path.join(appPath, yarnRelativePath);
      if (fs.existsSync(yarnAbsPath)) {
        return `node ${yarnAbsPath}`;
      }
    }
  } catch {
    // No .yarnrc.yml or unreadable — fall through
  }

  // Fall back to checking the packageManager field for pnpm or npm.
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(appPath, 'package.json'), 'utf8'));
    const pm = pkg.packageManager;
    if (typeof pm === 'string') {
      const [name] = pm.split('@');
      if (name === 'npm') return NPM;
      if (name === 'pnpm') return 'pnpm';
    }
  } catch {
    // package.json not readable — fall through to default
  }

  return defaultInstaller;
}

function installDeps(installer) {
  Logger.info(`Installing dependencies using ${installer}...`);
  Logger.empty();

  const [bin, ...extraArgs] = installer.split(' ');
  const installArgs = [...extraArgs, 'install'];
  // Add npm specific args to suppress log output
  if (bin === NPM) {
    installArgs.push('--loglevel', 'error');
  }

  // Install Dependencies
  const proc = spawnSync(bin, installArgs, { stdio: 'inherit', shell: true });
  if (proc.status !== 0) {
    const error = new Error(`${installer} install failed`);
    error.command = `${installer} install`;
    throw error;
  }
}

async function run({ appPath, appName, originalDirectory, template, installer, branchOverride }) {
  try {
    await cloneStarter({
      template,
      appName,
      appPath,
      originalDirectory,
      branchOverride,
    });

    // Update the Package JSON with correct deps and name/versions
    updatePackageJson({
      appName,
      appPath,
    });

    // Re-detect installer now that we have the cloned package.json.
    // The template may declare a specific packageManager (e.g. yarn@4)
    // that requires corepack rather than the bare global binary.
    const resolvedInstaller = detectInstaller(appPath, installer);

    // Install Dependencies
    installDeps(resolvedInstaller);

    // Display the most elegant way to cd.
    // This needs to handle an undefined originalDirectory for
    // backward compatibility with old global-cli's.
    const cdpath = originalDirectory && path.join(originalDirectory, appName) === appPath ? appName : appPath;

    Logger.empty();
    Logger.success(`Success! Created ${appName} at ${appPath}`);
    Logger.info('Inside that directory, you can run several commands:');
    Logger.info();
    Logger.info(chalk.cyan(`  ${resolvedInstaller} start`));
    Logger.info('    Starts the development server.');
    Logger.info();
    Logger.info(chalk.cyan(`  ${resolvedInstaller} run build`));
    Logger.info('    Bundles the app into static files for production.');
    Logger.info();
    Logger.info(chalk.cyan(`  ${resolvedInstaller} test`));
    Logger.info('    Starts the test runner.');
    Logger.info();
    Logger.info('We suggest that you begin by typing:');
    if (originalDirectory !== appPath) {
      Logger.info(chalk.cyan(`  cd ${cdpath}`));
    }
    Logger.info(`  ${chalk.cyan(`${resolvedInstaller} start`)}`);
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
    const knownGeneratedFiles = ['package.json', 'package-lock.json', 'node_modules', 'yarn.lock'];
    let currentFiles;
    try {
      currentFiles = fs.readdirSync(path.join(appPath));
    } catch {
      // Directory doesn't exist or isn't readable — nothing to clean up.
      Logger.info('Done.');
      process.exit(1);
    }
    for (const file of currentFiles) {
      for (const fileToMatch of knownGeneratedFiles) {
        // This remove all of knownGeneratedFiles.
        if (file === fileToMatch) {
          Logger.info(`Deleting generated file... ${chalk.cyan(file)}`);
          fs.rmSync(path.join(appPath, file), { recursive: true, force: true });
        }
      }
    }
    const remainingFiles = fs.readdirSync(path.join(appPath));
    if (remainingFiles.length === 0) {
      // Delete target folder if empty
      Logger.info(`Deleting ${chalk.cyan(`${appName}/`)} from ${chalk.cyan(path.resolve(appPath, '..'))}`);
      process.chdir(path.resolve(appPath, '..'));
      fs.rmSync(path.join(appPath), { recursive: true, force: true });
    }
    Logger.info('Done.');
    process.exit(1);
  }
}

async function createApp({ projectName: name, currentDir, template, useNpm, branchOverride }) {
  const appPath = currentDir ? process.cwd() : path.resolve(name);
  const appName = currentDir ? name : path.basename(appPath);
  const installer = useNpm ? NPM : YARN;

  checkAppName(appName);

  if (!currentDir) {
    fs.mkdirSync(name, { recursive: true });
  }

  Logger.info(`Creating a new Availity app in ${chalk.green(appPath)}.`);
  Logger.empty();

  const originalDirectory = process.cwd();
  process.chdir(appPath);
  // checkThatWeCanReadCwd uses `npm config list` output which is npm-specific.
  // Only run it when npm is the installer; for yarn/pnpm it's always a no-op.
  if (installer === NPM && !checkThatWeCanReadCwd(installer)) {
    process.exit(1);
  }

  await run({ appPath, appName, originalDirectory, template, installer, branchOverride });
}

export { createApp };
