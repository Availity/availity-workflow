var argv = require('minimist')(process.argv.slice(2));

var commands = {
  lint: require('./lint'),
  release: require('./release')
};


commands[argv.command]();
