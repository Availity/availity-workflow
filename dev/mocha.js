'use strict';

const Mocha = require('mocha');
const Promise = require('bluebird');
const globby = require('globby');

const Logger = require('../logger');

require('babel-register');

const SPEC_JS = 'project/app/**/*.spec.js';

function run(mocha) {
  return new Promise((resolve, reject) => {
    mocha.run((failures) => {

      if (failures > 0) {
        Logger.failed('Failed testing');
        reject();

      } else {
        Logger.ok('Finished testing');
        resolve();
      }
    });
  });
}

function test() {
  Logger.info('Started testing');
  process.env.NODE_ENV = 'testing';

  const mocha = new Mocha();

  return new Promise((resolve, reject) => {
    return globby(SPEC_JS)
      .then(paths => {
        paths.forEach(path => mocha.addFile(path));
        return mocha;
      })
      .then(run)
      .then(resolve)
      .catch(reject);
  });
}

module.exports = test;
