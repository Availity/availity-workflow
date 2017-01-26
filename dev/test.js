'use strict';

const karma = require('./karma');
const mocha = require('./mocha');

function test(runner) {
  if (runner === 'mocha') {
    return mocha();
  }

  return karma.continous();
}


module.exports = test;
