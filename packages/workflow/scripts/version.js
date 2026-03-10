/* eslint-disable unicorn/no-useless-promise-resolve-reject */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import semver from 'semver';
import { rawlist, input, Separator } from '@inquirer/prompts';
import yargs from 'yargs';
import Logger from '@availity/workflow-logger';
import settings from '../settings/index.js';

// Add a new line character to end of contents
function newLine(contents) {
  const lastChar = contents && contents.slice(-1) === '\n' ? '' : '\n';
  return contents + lastChar;
}

function tag() {
  if (settings.isDistribution() && !settings.isDryRun()) {
    const message = settings.commitMessage()
      ? `${settings.commitMessage()} v${settings.version}`
      : `v${settings.version}`;
    execSync('git add --all', { stdio: 'inherit' });
    execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
    execSync(`git tag -a "${message}" -m "${message}"`, { stdio: 'inherit' });
  } else {
    Logger.message('Skipping git commands', 'Dry Run');
  }

  return Promise.resolve(true);
}

function bump() {
  Logger.info('Starting version bump');

  if (!settings.isDistribution()) {
    settings.version = new Date().toISOString();
  }

  if (!settings.version) {
    return Promise.reject(new Error('version is undefined'));
  }

  const pkg = settings.pkg();
  pkg.version = settings.version;

  let contents = JSON.stringify(pkg, null, 2);
  contents = newLine(contents);

  // update package.pkg
  if (settings.isDistribution() && !settings.isDryRun()) {
    fs.writeFileSync(path.join(process.cwd(), 'package.json'), contents, 'utf8');
    Logger.success('Finished version bump');
  } else {
    Logger.message('Skipping version bump', 'Dry Run');
  }

  return Promise.resolve(true);
}

async function prompt() {
  if (!settings.isDistribution()) {
    return Promise.resolve(true);
  }

  const { version } = settings.pkg();
  const parsed = semver.parse(version);
  const yargsArgv = yargs(process.argv.slice(2)).argv;
  const versionArg = yargsArgv.version || yargsArgv._[1];

  if (versionArg) {
    let error;
    if (semver.valid(versionArg)) {
      if (semver.gt(versionArg, version)) {
        settings.version = versionArg;
        return Promise.resolve(true);
      }
      error = `must be greater than the current version [${version}].`;
    } else {
      error = `is not a valid semver version.`;
    }
    error = `Specified version [${versionArg}] ${error}`;
    Logger.error(error);
    throw new Error(error);
  }

  // regular release
  const simpleVersion = `${parsed.major}.${parsed.minor}.${parsed.patch}`;

  let choices = [
    {
      name: `patch ( ${version} => ${semver.inc(simpleVersion, 'patch')} )`,
      value: semver.inc(simpleVersion, 'patch')
    },
    {
      name: `minor ( ${version} => ${semver.inc(simpleVersion, 'minor')} )`,
      value: semver.inc(simpleVersion, 'minor')
    },
    {
      name: `major ( ${version} => ${semver.inc(simpleVersion, 'major')} )`,
      value: semver.inc(simpleVersion, 'major')
    },
    new Separator(),
    { name: 'other', value: 'other' }
  ];

  // pre-release
  if (parsed.prerelease && parsed.prerelease.length > 0) {
    choices = [
      {
        name: `prerelease ( ${version} => ${semver.inc(version, 'prerelease', parsed[0])} )`,
        value: semver.inc(version, 'prerelease', parsed[0])
      },
      {
        name: `release ( ${version} => ${simpleVersion} )`,
        value: simpleVersion
      },
      new Separator(),
      { name: 'other', value: 'other' }
    ];
  }

  const bumpChoice = await rawlist({
    message: 'What type of version bump would you like to do?',
    choices
  });

  if (bumpChoice === 'other') {
    const customVersion = await input({
      message: `version (current version is ${settings.pkg().version})`,
      validate(value) {
        const valid = semver.valid(semver.clean(value));
        if (valid) {
          return true;
        }
        return 'Enter valid semver version. See https://docs.npmjs.com/misc/semver for more details.';
      }
    });
    settings.version = semver.clean(customVersion);
  } else {
    settings.version = bumpChoice;
  }

  return settings.version;
}

export { tag, prompt, bump };
