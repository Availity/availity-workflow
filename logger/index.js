var utils = require('gulp-util');
var chalk = require('chalk');
var util = require('util');

var log = function(color, message) {
  utils.log([chalk[color](util.format.apply(util, message))].join(' '));
};

module.exports = {

  log: function() {
    log('grey', Array.prototype.slice.call(arguments));
  },

  info: function() {
    log('blue', Array.prototype.slice.call(arguments));
  },

  warn: function() {
    log('yellow', Array.prototype.slice.call(arguments));
  },

  error: function() {
    log('red', Array.prototype.slice.call(arguments));
  }
};
