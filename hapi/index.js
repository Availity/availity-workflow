var Hapi = require('hapi');
var h2o2 = require('h2o2');
var Hoek = require('hoek');
var inert = require('inert');
var BPromise = require('bluebird');

var pluginMock = require('./plugin-mock');
var pluginWebpack = require('./plugin-webpack');
var logger = require('../logger');
var context = require('../context');

function Server() {

  this.server = new Hapi.Server();
  this.server.connection({
    host: context.getConfig().servers.app.host,
    port: context.getConfig().servers.app.port,
    labels: ['web']
  });

}

var proto = Server.prototype;

proto.start = function() {

  var self = this;

  return new BPromise(function(resolve, reject) {

    self.server.register([h2o2, inert, pluginMock, pluginWebpack], function(err) {

      if (err) {
        Hoek.assert(!err, err);
        reject(false);
        return;
      }

      self.server.start(function() {
        logger.info('[hapi] Server started at ' + self.server.info.uri);
        resolve(true);
      });

    });

  });
};

proto.stop = function() {

  var self = this;

  return new BPromise(function(resolve, reject) {
    self.server.stop({ timeout: 60 * 1000 }, function(err) {

      if (err) {
        reject(false);
        return;
      }

      resolve(true);
      logger.info('Server stopped');
    });
  });

};

module.exports = Server;
