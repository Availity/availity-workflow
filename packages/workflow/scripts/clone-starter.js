/* eslint-disable import/newline-after-import */
/**
 * Motivation
 * https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-cli/src/init-starter.js
 */
const execa = require(`execa`);
const hostedGitInfo = require(`hosted-git-info`);
const fs = require(`fs-extra`);
const sysPath = require(`path`);
const Logger = require('@availity/workflow-logger');
const url = require(`url`);
const isValid = require(`is-valid-path`);

const spawn = (cmd, options) => {
  const [file, ...args] = cmd.split(/\s+/);
  return execa(file, args, { stdio: `inherit`, ...options });
};

// Clones starter from URI.
const clone = async (hostInfo, appPath) => {
  let url;
  // Let people use private repos accessed over SSH.
  // eslint-disable-next-line unicorn/prefer-ternary
  if (hostInfo.getDefaultRepresentation() === `sshurl`) {
    url = hostInfo.ssh({ noCommittish: true });
    // Otherwise default to normal git syntax.
  } else {
    url = hostInfo.https({ noCommittish: true, noGitPlus: true });
  }

  const branch = hostInfo.committish ? `-b ${hostInfo.committish}` : ``;

  Logger.info(`Creating new site from git: ${url}`);

  await spawn(`git clone ${branch} ${url} ${appPath} --single-branch`);

  Logger.success(`Created starter directory layout`);

  await fs.remove(sysPath.join(appPath, `.git`));
};

/**
 * Main function that clones or copies the starter.
 */
module.exports = async ({ template: templateUrl, appPath }) => {
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
    await clone(hostedInfo, appPath);
  } else {
    Logger.failed('Could not find Hosted Git Info for the Project.', hostedInfo);
  }
};
