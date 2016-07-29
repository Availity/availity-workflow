var dateformat = require('dateformat');
var figures = require('figures');

var template = '[{grey:%s}]} {yellow:[av-workflow]} ';

var Logger = require('eazy-logger').Logger;

var proto = Logger.prototype;

proto.ok = function(message) {
  this.info('{green:%s} %s', figures.tick, message);
};

proto.alert = function(message) {
  this.info('{cyan:%s} %s', figures.info, message);
};

proto.fail = function(message) {
  this.error('{red:%s %s}', figures.cross, message);
};

var logger = new Logger({
  prefix: template.replace('%s', dateformat(new Date(), 'HH:MM:ss')),
  useLevelPrefixes: false,
  level: 'warn'
});

module.exports = logger;
