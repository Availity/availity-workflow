var opn = require('opn');
var _ = require('lodash');
var Promise = require('bluebird');

var context = require('../context');
var logger = require('../logger');

function open() {

  if (context.getConfig().open) {

    var _url = _.template('http://localhost:<%= port %>/<%= open %>');

    var url = _url({
      port: context.getConfig().servers.app.port,
      open: context.getConfig().open
    });

    opn(url);
    logger.ok('Finished opening default browser');
  }

  return Promise.resolve(true);
}

module.exports = open;
