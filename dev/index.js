var argv = require('yargs').argv;

var commands = {
  lint: require('./lint'),
  release: require('./release')
};

commands[argv.command]();
