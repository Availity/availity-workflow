var dateformat = require('dateformat');

var template = '[{grey:%s}]} {yellow:[av]} ';

var Logger = require('eazy-logger').Logger;

var logger = new Logger({
  prefix: template.replace('%s', dateformat(new Date(), 'HH:MM:ss')),
  useLevelPrefixes: false
});

module.exports = logger;
