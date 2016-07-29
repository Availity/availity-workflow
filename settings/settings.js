var path = require('path');
var argv = require('yargs').argv;

var settings =  {

  packages: {
    src: [path.join(process.cwd(), './package.json'), path.join(process.cwd(), './bower.json')]
  },

  project: {
    path: process.cwd()
  },

  dest: function() {
    return this.isDistribution() ? path.join(process.cwd(), './dist') : path.join(process.cwd(), './build');
  },

  verbose: !!argv.verbose,

  args: argv,

  environment: function() {
    return process.env.NODE_ENV || 'development';
  },

  isTesting: function() {
    return this.environment() === 'testing';
  },

  isDistribution: function() {
    return this.isProduction() || this.isStaging();
  },

  isDebug: function() {
    return this.environment() === 'debug';
  },

  isStaging: function() {
    return this.environment() === 'staging';
  },

  isIntegration: function() {
    return this.environment() === 'integration';
  },

  isDevelopment: function() {
    return this.environment() === 'development';
  },

  isProduction: function() {
    return this.environment() === 'production';
  },

  // Uses globby which defaults to process.cwd() and path.resolve(options.cwd, "/")
  js: {
    src: [
      '**/**.js',
      '!node_modules/**',
      '!bower_components/**',
      '!dist/**',
      '!reports/**',
      '!build/**'
    ],
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
    cwd: 'project/app',
    src: [
      '**/*.html',
      '!project/app/index.html'
    ]
  }
};

module.exports = settings;

