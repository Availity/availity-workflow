'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('lodash');

module.exports = function(cli, template) {
  const contents = _.template(template)(cli.answers);

  const instructions = path.join(process.cwd(), 'INSTRUCTIONS.md');
  const readme = path.join(process.cwd(), 'README.md');

  // Copy the original README to INSTRUCTIONS
  if (!fs.existsSync(instructions)) {
    fs.writeFileSync(instructions, fs.readFileSync(readme));
  }

  fs.writeFileSync(path.join(process.cwd(), 'README.md'), contents, 'utf8');
};
