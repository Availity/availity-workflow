'use strict';

const path = require('path');

const settings = {

  packages() {
    return path.join(this.project(), './package.json');
  },

  project() {
    return process.cwd();
  },

  dest() {
    return this.isDistribution() ? path.join(this.project(), './dist') : path.join(this.project(), './build');
  },

  ekko: {
    data() {
      return path.join(this.project(), 'project/data');
    },
    routes() {
      return path.join(this.project(), 'project/config/routes.json');
    }
  },

  servers: {
    app: {
      host: '127.0.0.1',
      port: 3000
    },
    web: {
      host: '127.0.0.1',
      port: 9999
    }
  },

  environment() {
    return process.env.NODE_ENV || 'development';
  },

  isTesting() {
    return this.environment() === 'testing';
  },

  isDistribution() {
    return this.isProduction() || this.isStaging();
  },

  isDebug() {
    return this.environment() === 'debug';
  },

  isStaging() {
    return this.environment() === 'staging';
  },

  isIntegration() {
    return this.environment() === 'integration';
  },

  isDevelopment() {
    return this.environment() === 'development';
  },

  isProduction() {
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
    ]
  },

  set(overrides) {
    Object.assign(this, overrides);
  }

};

module.exports = settings;
