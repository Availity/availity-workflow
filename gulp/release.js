var fs = require('fs');
var path = require('path');
var semver = require('semver');
var del = require('del');
var inquirer = require('inquirer');
var _ = require('lodash');
var shell = require('shelljs');
var BPromise = require('bluebird');

var VERSION = null;
var RAW = null;

var context = require('../context');

function raw() {

  if (!RAW) {
    RAW = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8');
  }

  return RAW;
}

function pkg(contents) {
  return JSON.parse(contents || raw());
}

function git() {

  return new BPromise(function(resolve) {

    shell.exec('git add .');
    shell.exec('git commit -m "v' + VERSION + '"');
    shell.exec('git tag -a v' + VERSION + ' -m "v' + VERSION + '"');

    resolve();

  });
}

function newLine(contents) {
  var lastChar = (contents && contents.slice(-1) === '\n') ? '' : '\n';
  return contents + lastChar;
}

function bump() {

  return new BPromise(function(resolve, reject) {

    if (!VERSION) {
      return reject(false);
    }

    var contents = raw();
    var json = pkg(contents);

    json = _.merge({}, json, {version: VERSION});

    contents = JSON.stringify(json, null, 2);
    contents = newLine(contents);

    // update package.json
    fs.writeFileSync(path.join(process.cwd(), 'package.json'), contents, 'utf8');

    resolve();


  });

}

function prompt() {

  var version = pkg().version;
  var parsed = semver.parse(version);

  // regular release
  var simpleVersion = parsed.major + '.' + parsed.minor + '.' + parsed.patch;
  'use strict';

  var choices = [
    { name: 'patch ( ' + version + ' --> ' + semver.inc(simpleVersion, 'patch'), value: semver.inc(simpleVersion, 'patch') },
    { name: 'minor ( ' + version + ' --> ' + semver.inc(simpleVersion, 'minor'), value: semver.inc(simpleVersion, 'minor') },
    { name: 'major ( ' + version + ' --> ' + semver.inc(simpleVersion, 'major'), value: semver.inc(simpleVersion, 'major') },
    new inquirer.Separator(), { name: 'other', value: 'other' }
  ];

  // pre-release
  if (parsed.prerelease && parsed.prerelease.length) {
    choices = [
      { name: 'prerelease ( ' + version + ' => ' + semver.inc(version, 'prerelease', parsed[0]) + ')', value: semver.inc(version, 'prerelease', parsed[0]) },
      { name: 'release ( ' + version + ' => ' + simpleVersion + ')', value: simpleVersion },
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

        return 'Enter valid semver version number.  Please see https://docs.npmjs.com/misc/semver for more details.';

      }

    }
  ];

  return new BPromise( function(resolve) {

    inquirer.prompt(questions, function(answers) {

      VERSION = answers.bump !== 'other' ? answers.bump : answers.version;

      return resolve();

    });

  });

}

function release() {

  return prompt()
    .then(bump)
    .then(git);

}

var runSequence = require('run-sequence').use(context.gulp);

context.gulp.task('av:release:sequence', function(cb) {

  del.sync([context.settings.dest()]);

  runSequence(
    'av:lint',
    context.settings.isProduction() ?  'av:release:bump' : 'av:noop',
    ['av:copy', 'av:concat'],
    'av:build',
    context.settings.isProduction() ?  'av:release:git' : 'av:noop',
    cb
  );
});

context.gulp.task('av:noop', function() {
  return context.gulp.src('');
});

context.gulp.task('av:release:git', function() {
  return git();
});

context.gulp.task('av:release:add', function() {
  return context.gulp.src('');  // deprecated
});

context.gulp.task('av:release:tag', function() {
  return context.gulp.src(''); // deprecated
});

context.gulp.task('av:release:bump', function() {
  return bump();
});

context.gulp.task('av:release', function() {

  if (context.settings.isStaging() || context.settings.isDevelopment()) {
    return context.gulp.start('av:release:sequence');
  }

  return release();

});
