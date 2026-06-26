/* eslint-disable unicorn/no-process-exit */
import validateProjectName from 'validate-npm-package-name';
import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import Logger from '@availity/workflow-logger';
import cloneStarter from './clone-starter.js';

function checkAppName(appName) {
  const validationResult = validateProjectName(appName);
  if (!validationResult.validForNewPackages) {
    Logger.failed(`Could not create a project called "${appName}" because of npm naming restrictions:`);
    if (validationResult.errors) {
      for (const error of validationResult.errors) Logger.error(`  *  ${error}`);
    }
    process.exit(1);
  }
}

function updatePackageJson({ appName, appPath }) {
  const appPackage = JSON.parse(fs.readFileSync(path.join(appPath, 'package.json'), 'utf8'));
  appPackage.name = appName;
  appPackage.version = '0.1.0';
  appPackage.private = true;
  fs.writeFileSync(path.join(appPath, 'package.json'), JSON.stringify(appPackage, null, 2) + os.EOL);
}

function installDeps(installer) {
  Logger.info(`Installing dependencies using ${installer}...`);
  const installArgs = installer === 'npm' ? ['install', '--loglevel', 'error'] : ['install'];
  const proc = spawnSync(installer, installArgs, { stdio: 'inherit', shell: true });
  if (proc.status !== 0) Logger.failed(`${installer} install failed`);
}

async function run({ appPath, appName, originalDirectory, template, installer, branchOverride }) {
  try {
    await cloneStarter({ template, appName, appPath, originalDirectory, branchOverride });
    updatePackageJson({ appName, appPath });
    installDeps(installer);

    const cdpath = originalDirectory && path.join(originalDirectory, appName) === appPath ? appName : appPath;
    Logger.empty();
    Logger.success(`Success! Created ${appName} at ${appPath}`);
    Logger.info('Inside that directory, you can run:');
    Logger.info(`  ${chalk.cyan(`${installer} start`)}  — Starts the Vite development server`);
    Logger.info(`  ${chalk.cyan(`${installer} run build`)}  — Bundles the app for production`);
    Logger.info(`  ${chalk.cyan(`${installer} test`)}  — Runs tests with Vitest`);
    Logger.info();
    Logger.info('Begin by typing:');
    if (originalDirectory !== appPath) Logger.info(chalk.cyan(`  cd ${cdpath}`));
    Logger.info(`  ${chalk.cyan(`${installer} start`)}`);
  } catch (error) {
    Logger.failed('Aborting installation.');
    if (error.command) {
      Logger.error(`  ${chalk.cyan(error.command)} has failed.`);
    } else {
      Logger.error(error);
    }
    // Clean up on failure
    const knownFiles = new Set(['package.json', 'package-lock.json', 'node_modules', 'yarn.lock']);
    for (const file of fs.readdirSync(appPath)) {
      if (knownFiles.has(file)) fs.rmSync(path.join(appPath, file), { recursive: true, force: true });
    }
    if (fs.readdirSync(appPath).length === 0) {
      process.chdir(path.resolve(appPath, '..'));
      fs.rmSync(appPath, { recursive: true, force: true });
    }
    process.exit(1);
  }
}

async function createApp({ projectName: name, currentDir, template, useNpm, branchOverride }) {
  const appPath = currentDir ? process.cwd() : path.resolve(name);
  const appName = currentDir ? name : path.basename(appPath);
  const installer = useNpm ? 'npm' : 'yarn';

  checkAppName(appName);
  if (!currentDir) fs.mkdirSync(name, { recursive: true });

  Logger.info(`Creating a new Availity Vite app in ${chalk.green(appPath)}.`);
  Logger.empty();

  const originalDirectory = process.cwd();
  process.chdir(appPath);
  await run({ appPath, appName, originalDirectory, template, installer, branchOverride });
}

export { createApp };
