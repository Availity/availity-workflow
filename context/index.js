var _ = require('lodash');
var utils = require('../utils');

var Context = function() {

  this.settings = require('../settings');
  this.meta = {};

  var environment = utils.env.load(this);
  _.merge(this.settings, environment);

};

var proto = Context.prototype;

proto.set = function(context) {

  var self = this;

  _.forEach(['gulp', 'webpack', 'karma', 'eventEmitter'], function(value) {
    self[value] = context[value];
  });

};

proto.getConfig = function() {
  var environment = process.env.NODE_ENV || 'development';
  return this.settings[environment];
};

proto.emit = function () {
  var self = this;
  if (self.eventEmitter) {
    self.eventEmitter.apply(self.eventEmitter, arguments);
  }
};


module.exports = new Context();
