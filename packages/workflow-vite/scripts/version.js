import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import semver from 'semver';
import { rawlist, input, Separator } from '@inquirer/prompts';
import Logger from '@availity/workflow-logger';

const execFileAsync = promisify(execFile);

function newline(contents) {
  return contents + (contents.slice(-1) === '\n' ? '' : '\n');
}

async function tag(settings) {
  if (settings.isDistribution() && !settings.isDryRun()) {
    const message = settings.commitMessage()
      ? `${settings.commitMessage()} v${settings._version}`
      : `v${settings._version}`;
    await execFileAsync('git', ['add', '--all']);
    await execFileAsync('git', ['commit', '-m', message]);
    await execFileAsync('git', ['tag', '-a', message, '-m', message]);
  } else {
    Logger.message('Skipping git commands', 'Dry Run');
  }
}

async function bump(settings) {
  Logger.info('Starting version bump');
  if (!settings.isDistribution()) settings._version = new Date().toISOString();
  if (!settings._version) throw new Error('version is undefined');

  const pkg = settings.pkg();
  pkg.version = settings._version;
  const contents = newline(JSON.stringify(pkg, null, 2));

  if (settings.isDistribution() && !settings.isDryRun()) {
    await fs.promises.writeFile(path.join(process.cwd(), 'package.json'), contents, 'utf8');
    Logger.success('Finished version bump');
  } else {
    Logger.message('Skipping version bump', 'Dry Run');
  }
}

async function prompt(settings, versionArg) {
  if (!settings.isDistribution()) return true;

  const { version } = settings.pkg();
  const parsed = semver.parse(version);

  if (versionArg) {
    if (semver.valid(versionArg) && semver.gt(versionArg, version)) {
      settings._version = versionArg;
      return true;
    }
    const error = semver.valid(versionArg)
      ? `Specified version [${versionArg}] must be greater than current [${version}].`
      : `Specified version [${versionArg}] is not valid semver.`;
    Logger.error(error);
    throw new Error(error);
  }

  const simpleVersion = `${parsed.major}.${parsed.minor}.${parsed.patch}`;
  let choices;

  if (parsed.prerelease && parsed.prerelease.length > 0) {
    choices = [
      {
        name: `prerelease ( ${version} => ${semver.inc(version, 'prerelease', parsed[0])} )`,
        value: semver.inc(version, 'prerelease', parsed[0]),
      },
      { name: `release ( ${version} => ${simpleVersion} )`, value: simpleVersion },
      new Separator(),
      { name: 'other', value: 'other' },
    ];
  } else {
    choices = [
      {
        name: `patch ( ${version} => ${semver.inc(simpleVersion, 'patch')} )`,
        value: semver.inc(simpleVersion, 'patch'),
      },
      {
        name: `minor ( ${version} => ${semver.inc(simpleVersion, 'minor')} )`,
        value: semver.inc(simpleVersion, 'minor'),
      },
      {
        name: `major ( ${version} => ${semver.inc(simpleVersion, 'major')} )`,
        value: semver.inc(simpleVersion, 'major'),
      },
      new Separator(),
      { name: 'other', value: 'other' },
    ];
  }

  const bumpChoice = await rawlist({ message: 'What type of version bump?', choices });

  if (bumpChoice === 'other') {
    const customVersion = await input({
      message: `version (current: ${version})`,
      validate: (v) => (semver.valid(semver.clean(v)) ? true : 'Enter valid semver.'),
    });
    settings._version = semver.clean(customVersion);
  } else {
    settings._version = bumpChoice;
  }

  return settings._version;
}

export default { tag, prompt, bump };
