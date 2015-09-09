var updateNotifier = require('update-notifier');

var logger = require('../../logger');
var utils = require('../../utils');

var pkg = require('../../package.json');

module.exports = function(cli) {

  cli.program
    .command('about')
    .description('display version information about availity-workflow project')
    .action(function action() {

      var notifier = updateNotifier({
        pkg: pkg
      });

      var nameVer = notifier.packageName + ' v' + notifier.packageVersion;

      var message = '\n\n' +
        nameVer  +
        utils.availity +
        '- https://github.com/availity/availity-workflow\n' +
        '- https://twitter.com/availity\n' +
        '- https://developer.availity.com\n';

      logger.warn(message);
      notifier.notify();
    });
};
