'use strict';

const path = require('path');
const chalk = require('chalk');
const pathExists = require('path-exists');

const Logger = require('../logger');

const settings = {

  raw: null,

  maps() {
    return this.isDevelopment() ? 'source-map' : 'source-map';
  },

  entry() {

    if (this.isTesting()) {

      return {
        'index': './index.js'
      };

    }

    return {
      'index': './index.js',
      'vendor': './vendor.js'
    };
  },

  // Don’t use [chunkhash] in development since this will increase compilation time
  // In production, [chunkhash] generate hashes depending on the file contents this if
  // the contents don't change the file could potentially be cached in the browser.
  fileName() {
    return this.isDevelopment() ? '[name].js' : '[name]-[chunkhash].js';
  },

  css() {
    return this.isDevelopment() ? '[name].css' : '[name]-[chunkhash].css';
  },

  output() {
    return this.isDistribution() ?
      path.join(this.project(), 'dist') :
      path.join(this.project(), 'build');
  },

  packages() {
    return path.join(this.project(), './package.json');
  },

  project() {
    return process.cwd();
  },

  app() {
    return path.join(this.project(), 'project/app');
  },

  dest() {
    return this.isDistribution() ?
      path.join(this.project(), './dist') :
      path.join(this.project(), './build');
  },

  asset(filePath) {

    let templatePath = filePath;

    const hasLocalTemplate = pathExists.sync(path.join(this.app(), templatePath));
    templatePath = hasLocalTemplate ? templatePath : path.relative(this.app(), path.join(__dirname, '../webpack', templatePath));
    const name = path.basename(templatePath);

    if (!hasLocalTemplate) {
      Logger.warn(`Using from ${chalk.blue('availity-workflow/webpack/' + name)}`);
    }


    return templatePath;

  },

  template() {
    return this.asset('./index.html');
  },

  favicon() {
    return this.asset('./favicon.ico');
  },

  ekko() {
    return {
      data: path.join(this.project(), 'project/data'),
      routes: path.join(this.project(), 'project/config/routes.json')
    };
  },

  servers() {
    return {
      app: {
        host: '127.0.0.1',
        port: 3000
      },
      web: {
        host: '127.0.0.1',
        port: 9999
      }
    };

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

  isAngular() {
    return true;
  },

  // Uses globby which defaults to process.cwd() and path.resolve(options.cwd, "/")
  js() {
    return [
      '**/**.js',
      '!node_modules/**',
      '!bower_components/**',
      '!dist/**',
      '!reports/**',
      '!build/**'
    ];
  },

  coverage() {
    return path.join(process.cwd(), 'coverage');
  },

  set(overrides) {
    Object.assign(this, overrides);
  }

};

module.exports = settings;
