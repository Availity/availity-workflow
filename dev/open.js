var o = require('open');
var _ = require('lodash');
var Promise = require('bluebird');

var context = require('../context');

function open() {

  var _url = _.template('http://localhost:<%= port %>/<%= open %>');

  if (context.getConfig().open) {
    var url = _url({
      port: context.getConfig().servers.app.port,
      open: context.getConfig().open
    });

    o({uri: url});
  }

  return Promise.resolve(true);

}

module.exports = open;
