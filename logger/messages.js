var symbols = require('log-symbols');
var chalk = require('chalk');

var messages = {

  missingConfig: '' +
    symbols.warning +
    '  Missing ' + chalk.gray('./project/config/developer-config')
};

module.exports = messages;
