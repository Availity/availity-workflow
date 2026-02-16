/**
 * Motivation
 * https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-cli/src/init-starter.js
 */
import { spawn as nodeSpawn } from 'child_process';
import hostedGitInfo from 'hosted-git-info';
import fs from 'fs';
import sysPath from 'path';
import Logger from '@availity/workflow-logger';

const spawn = (cmd, options) => {
  const [file, ...args] = cmd.split(/\s+/);
  return new Promise((resolve, reject) => {
    const child = nodeSpawn(file, args, { stdio: 'inherit', ...options });
    child.on('close', (code) => {
      if (code !== 0) {
        const error = new Error(`Command failed: ${cmd}`);
        error.command = cmd;
        reject(error);
      } else {
        resolve();
      }
    });
    child.on('error', reject);
  });
};

// Clones starter from URI.
const clone = async (hostInfo, appPath, branchOverride) => {
  let url;
  // Let people use private repos accessed over SSH.
  // eslint-disable-next-line unicorn/prefer-ternary
  if (hostInfo.getDefaultRepresentation() === `sshurl`) {
    url = hostInfo.ssh({ noCommittish: true });
    // Otherwise default to normal git syntax.
  } else {
    url = hostInfo.https({ noCommittish: true, noGitPlus: true });
  }

  let branch = ``;

  if (branchOverride) {
    branch = `-b ${branchOverride}`;
  } else if (hostInfo.committish) {
    branch = `-b ${hostInfo.committish}`;
  }

  Logger.info(`Creating new site from git: ${url}`);

  await spawn(`git clone ${branch} ${url} ${appPath} --single-branch`);

  Logger.success(`Created starter directory layout`);

  fs.rmSync(sysPath.join(appPath, `.git`), { recursive: true, force: true });
};

/**
 * Main function that clones or copies the starter.
 */
export default async ({ template: templateUrl, appPath, branchOverride }) => {
  try {
    const parsed = new URL(appPath);
    if (parsed.protocol && parsed.host) {
      Logger.failed(
        `It looks like you forgot to add a name for your new project. Try running instead "npx @availity/workflow init new-project"`
      );
      return;
    }
  } catch {
    // Not a URL, continue
  }

  if (typeof appPath !== 'string' || appPath.length === 0 || appPath.includes('\0')) {
    Logger.failed(`Could not create a project in "${sysPath.resolve(appPath)}" because it's not a valid path`);
    return;
  }

  const hostedInfo = hostedGitInfo.fromUrl(templateUrl);

  if (hostedInfo) {
    await clone(hostedInfo, appPath, branchOverride);
  } else {
    Logger.failed('Could not find Hosted Git Info for the Project.', hostedInfo);
  }
};
