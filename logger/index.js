var dateformat = require('dateformat');

var template = '[{grey:%s}]} {yellow:[av-workflow]} ';

var Logger = require('eazy-logger').Logger;

var logger = new Logger({
  prefix: template.replace('%s', dateformat(new Date(), 'HH:MM:ss')),
  useLevelPrefixes: false,
  level: 'warn'
});

module.exports = logger;
