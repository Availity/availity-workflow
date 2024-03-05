/* eslint-disable import/newline-after-import */
/**
 * Motivation
 * https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-cli/src/init-starter.js
 */
import execa from `execa`;
import hostedGitInfo from `hosted-git-info`;
import fs from `fs-extra`;
import sysPath from `node:path`;
import Logger from '@availity/workflow-logger';
import url from `node:url`;
import isValid from `is-valid-path`;

const spawn = (cmd, options) => {
  const [file, ...args] = cmd.split(/\s+/);
  return execa(file, args, { stdio: `inherit`, ...options });
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
    branch = `-b ${branchOverride}`
  } else if (hostInfo.committish) {
    branch = `-b ${hostInfo.committish}`
  }

  Logger.info(`Creating new site from git: ${url}`);

  await spawn(`git clone ${branch} ${url} ${appPath} --single-branch`);

  Logger.success(`Created starter directory layout`);

  await fs.remove(sysPath.join(appPath, `.git`));
};

/**
 * Main function that clones or copies the starter.
 */
export default async ({ template: templateUrl, appPath, branchOverride }) => {
  const urlObject = url.parse(appPath);
  if (urlObject.protocol && urlObject.host) {
    Logger.failed(
      `It looks like you forgot to add a name for your new project. Try running instead "npx @availity/workflow init new-project"`
    );
    return;
  }

  if (!isValid(appPath)) {
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
