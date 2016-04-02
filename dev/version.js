var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
var semver = require('semver');
var inquirer = require('inquirer');
var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');

var context = require('../context');
var logger = require('../logger');

function newLine(contents) {
  var lastChar = (contents && contents.slice(-1) === '\n') ? '' : '\n';
  return contents + lastChar;
}

function raw() {

  if (!context.meta.raw) {
    context.meta.raw = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8');
  }

  return context.meta.raw;
}

function pkg(contents) {
  return JSON.parse(contents || raw());
}

function tag() {

  if (!context.settings.isDistribution()) {
    return Promise.resolve(true);
  }

  return new Promise(function(resolve) {

    shell.exec('git add .');
    shell.exec('git commit -m "v' + context.meta.version + '"');
    shell.exec('git tag -a v' + context.meta.version + ' -m "v' + context.meta.version + '"');

    resolve();

  });
}

function bump() {

  return new Promise(function(resolve, reject) {

    logger.info('Starting versioning');

    if (!context.settings.isDistribution()) {
      context.meta.version = moment().format();
    }

    if (!context.meta.version) {
      return reject('version is undefined');
    }

    context.meta.pkg = pkg();
    context.meta.pkg = _.merge({}, context.meta.pkg, {version: context.meta.version});

    var contents = JSON.stringify(context.meta.pkg, null, 2);
    contents = newLine(contents);
    context.meta.raw = contents;

    // update package.pkg
    if (context.settings.isDistribution()) {
      fs.writeFileSync(path.join(process.cwd(), 'package.json'), contents, 'utf8');
    }

    logger.ok('Finished versioning');

    resolve();

  });

}

function prompt() {

  if (!context.settings.isDistribution()) {
    return Promise.resolve(true);
  }

  var version = pkg().version;
  var parsed = semver.parse(version);

  // regular release
  var simpleVersion = parsed.major + '.' + parsed.minor + '.' + parsed.patch;

  var choices = [
    { name: 'patch ( ' + version + ' => ' + semver.inc(simpleVersion, 'patch') + ' )', value: semver.inc(simpleVersion, 'patch') },
    { name: 'minor ( ' + version + ' => ' + semver.inc(simpleVersion, 'minor') + ' )', value: semver.inc(simpleVersion, 'minor') },
    { name: 'major ( ' + version + ' => ' + semver.inc(simpleVersion, 'major') + ' )', value: semver.inc(simpleVersion, 'major') },
    new inquirer.Separator(), { name: 'other', value: 'other' }
  ];

  // pre-release
  if (parsed.prerelease && parsed.prerelease.length) {
    choices = [
      { name: 'prerelease ( ' + version + ' => ' + semver.inc(version, 'prerelease', parsed[0]) + ' )', value: semver.inc(version, 'prerelease', parsed[0]) },
      { name: 'release ( ' + version + ' => ' + simpleVersion + ' )', value: simpleVersion },
      new inquirer.Separator(), { name: 'other', value: 'other' }
    ];
  }

  var questions = [
    {
      type: 'rawlist',
      name: 'bump',
      message: 'What type of version bump would you like to do?',
      choices: choices
    },
    {
      type: 'input',
      name: 'version',
      message: 'version (current version is ' + pkg().version + ')',
      when: function(answer) {
        return answer.bump === 'other';
      },
      filter: function(value) {
        return semver.clean(value);
      },
      validate: function(value) {

        var valid = semver.valid(value);

        if (valid) {
          return true;
        }

        return 'Enter valid semver version. See https://docs.npmjs.com/misc/semver for more details.';

      }

    }
  ];

  return new Promise( function(resolve) {

    inquirer.prompt(questions, function(answers) {

      context.meta.version = answers.bump !== 'other' ? answers.bump : answers.version;

      return resolve();

    });

  });

}

module.exports = {
  tag: tag,
  prompt: prompt,
  bump: bump
};
