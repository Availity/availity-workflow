var _ = require('lodash');
var utils = require('../utils');

var Context = function() {

  this.settings = require('../settings');
  var environment = utils.env.load(this);

  _.merge(this.settings, environment);

};

var proto = Context.prototype;

proto.set = function(context) {

  var self = this;

  _.forEach(['gulp', 'webpack', 'karma'], function(value) {
    self[value] = context[value];
  });

};

proto.getConfig = function() {
  var environment = process.env.NODE_ENV || 'development';
  return this.settings[environment];
};


module.exports = new Context();
