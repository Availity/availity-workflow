var argv = require('yargs').argv;

var commands = {
  lint: require('./lint'),
  release: require('./release'),
  copy: require('./copy'),
  build: require('./build'),
  version: require('./version'),
  start: require('./start'),
  complexity: require('./complexity')
};

commands[argv.command]();
