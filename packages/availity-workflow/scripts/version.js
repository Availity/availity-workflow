const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const semver = require('semver');
const inquirer = require('inquirer');
const _ = require('lodash');
const moment = require('moment');
const Promise = require('bluebird');
const settings = require('availity-workflow-settings');
const Logger = require('availity-workflow-logger');

// Add a new line character to end of contents
function newLine(contents) {
  const lastChar = contents && contents.slice(-1) === '\n' ? '' : '\n';
  return contents + lastChar;
}

function tag() {
  return new Promise(resolve => {
    if (settings.isDistribution() && !settings.isDryRun()) {
      shell.exec('git add --all');
      shell.exec(`git commit -m "v${settings.version}"`);
      shell.exec(`git tag -a v${settings.version} -m "v${settings.version}"`);
    } else {
      Logger.message('Skipping git commands', 'Dry Run');
    }

    resolve();
  });
}

function bump() {
  return new Promise((resolve, reject) => {
    Logger.info('Starting version bump');

    if (!settings.isDistribution()) {
      settings.version = moment().format();
    }

    if (!settings.version) {
      return reject('version is undefined');
    }

    const pkg = settings.pkg();
    _.merge(pkg, { version: settings.version });

    let contents = JSON.stringify(pkg, null, 2);
    contents = newLine(contents);

    // update package.pkg
    if (settings.isDistribution() && !settings.isDryRun()) {
      fs.writeFileSync(
        path.join(process.cwd(), 'package.json'),
        contents,
        'utf8'
      );
      Logger.success('Finished version bump');
    } else {
      Logger.message('Skipping version bump', 'Dry Run');
    }

    resolve();
  });
}

function prompt() {
  if (!settings.isDistribution()) {
    return Promise.resolve(true);
  }

  const version = settings.pkg().version;
  const parsed = semver.parse(version);

  // regular release
  const simpleVersion = `${parsed.major}.${parsed.minor}.${parsed.patch}`;

  let choices = [
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
    new inquirer.Separator(),
    { name: 'other', value: 'other' },
  ];

  // pre-release
  if (parsed.prerelease && parsed.prerelease.length) {
    choices = [
      {
        name: `prerelease ( ${version} => ${semver.inc(
          version,
          'prerelease',
          parsed[0]
        )} )`,
        value: semver.inc(version, 'prerelease', parsed[0]),
      },
      {
        name: `release ( ${version} => ${simpleVersion} )`,
        value: simpleVersion,
      },
      new inquirer.Separator(),
      { name: 'other', value: 'other' },
    ];
  }

  const questions = [
    {
      type: 'rawlist',
      name: 'bump',
      message: 'What type of version bump would you like to do?',
      choices,
    },
    {
      type: 'input',
      name: 'version',
      message: `version (current version is ${settings.pkg().version})`,
      when(answer) {
        return answer.bump === 'other';
      },
      filter(value) {
        return semver.clean(value);
      },
      validate(value) {
        const valid = semver.valid(value);

        if (valid) {
          return true;
        }

        return 'Enter valid semver version. See https://docs.npmjs.com/misc/semver for more details.';
      },
    },
  ];

  return inquirer.prompt(questions).then(answers => {
    settings.version =
      answers.bump !== 'other' ? answers.bump : answers.version;
  });
}

module.exports = {
  tag,
  prompt,
  bump,
};
