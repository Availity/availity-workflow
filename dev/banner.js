'use strict';

const fs = require('fs');
const path = require('path');
const settings = require('../settings');

function banner() {

  const pkg = JSON.parse(fs.readFileSync(path.join(settings.project(), 'package.json')));

  return `/**
  * ${pkg.name} v${pkg.version} -- ${new Date().toISOString().substr(0, 10)}
  */`;
}

module.exports = banner;
