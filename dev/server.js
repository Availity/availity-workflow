var nodemon = require('nodemon');
var path = require('path');
var Promise = require('bluebird');

var logger = require('../logger');
var context = require('../context');
var open = require('./open');

function warning() {

  if (!context.meta.developerConfig) {
    logger.warn('Missing {cyan:./project/config/developer-config.js}. Using defaults {cyan:https://github.com/Availity/availity-workflow/blob/master/settings/index.js}');
  }

  return Promise.resolve(true);

}

function web() {

  var Server = require('../hapi');
  var server = new Server();

  return server.start();

}

function rest() {

  var monitor = nodemon({
    script: path.join(__dirname, '..', 'ekko'),
    ext: 'json',
    watch: [
      path.join(context.settings.project.path, 'project/config/routes.json'),
      path.join(context.settings.project.path, 'project/data')
    ],
    env: {
      'NODE_ENV': 'development'
    }
  }).on('restart', function() {
    logger.info('{magenta:RESTARTED} Ekko server due configuration file changes');
  });

  // Capture ^C
  process.once('SIGINT', function() {
    monitor.once('exit', function() {
      process.exit();
    });
  });

  return Promise.resolve(true);

}

function start() {
  return warning()
    .then(rest)
    .then(web)
    .then(open);
}

module.exports = {
  start: start,
  web: web,
  rest: rest
};
