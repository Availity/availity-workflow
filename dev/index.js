#! /usr/bin/env node

var argv = require('yargs').argv;

var commands = {
  lint: require('./lint'),
  release: require('./release'),
  build: require('./build'),
  version: require('./version'),
  start: require('./start'),
  complexity: require('./complexity'),
  test: require('./test').continous
};

commands[argv._[0]]();
