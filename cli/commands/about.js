var chalk = require('chalk');

var logger = require('../../logger');
var utils = require('../../utils');

module.exports = function(cli) {

  cli.program
    .command('about')
    .description('display version information about availity-workflow project')
    .action(function action() {

      var notifier = utils.notifier();

      var nameVer = chalk.bold('v' + notifier.packageVersion);

      var message = '\n\n' +
        nameVer  +
        utils.availity +
        chalk.gray('- https://github.com/availity/availity-workflow\n') +
        chalk.gray('- https://twitter.com/availity\n') +
        chalk.gray('- https://developer.availity.com\n');

      logger.warn(message);

    });
};
