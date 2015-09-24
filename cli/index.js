#! /usr/bin/env node

var program = require('commander');
var meow = require('meow');
var _ = require('lodash');

var utils = require('../utils');
var manifests = utils.read();

program.version(manifests.package.json.version);

var cli = meow({
  help: false,
  pkg: manifests.package.json
});
cli.program = program;
cli.manifests = manifests;

var commands = require('require-dir')('./commands', { recurse: true });
_.forEach(commands, function(command) {
  command(cli);
});

program.parse(process.argv);

// if (!program.args.length)  {
  // this conflicts when running 'gulp' default task
  // program.help();
// }

