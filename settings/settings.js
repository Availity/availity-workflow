var path = require('path');
var argv = require('minimist')(process.argv.slice(2));

var _settings =  {

  project: {
    path: process.cwd()
  },

  dest: function() {
    return this.isProduction() ? path.join(process.cwd(), './dist') : path.join(process.cwd(), './build');
  },

  verbose: !!argv.verbose,

  args: argv,

  environment: function() {
    return process.env.NODE_ENV || 'development';
  },

  isTesting: function() {
    return this.environment() === 'testing';
  },

  isDevelopment: function() {
    return this.environment() === 'development';
  },

  isProduction: function() {
    return this.environment() === 'production';
  },

  js: {
    src: 'project/app/**/*.js',
    srcNode: [
      '!' + path.join(process.cwd(), 'project/app/**'),
      path.join(process.cwd(), 'gulpfile.js'),
      path.join(process.cwd(), 'project/server/*.js')
    ],
    linter: 'project/app/.eslintrc',
    linterNode: '.eslintrc',
    reportsDir: path.join(process.cwd(), 'reports')
  },

  polyfill: {
    name: 'polyfill.js',
    src: [
      'bower_components/html5shiv/dist/html5shiv.min.js',
      'bower_components/respond/dest/respond.min.js'
    ],
    dest: './build/js'
  },

  templates: {
    src: [
      '!project/app/index.html',
      'project/app/**/*.html'
    ]
  }
};

module.exports = _settings;

