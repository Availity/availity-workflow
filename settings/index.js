'use strict';

const path = require('path');
const chalk = require('chalk');
const exists = require('exists-sync');
const yargs = require('yargs');
const _ = require('lodash');

const Logger = require('../logger');
const file = require('../dev/file');

const settings = {

  raw: null,

  configuration: null,

  config() {

    if (this.configuration) {
      return this.configuration;
    }

    this.configuration = require('./workflow');
    let developerConfig = {};

    const configPath = path.join(settings.project(), '/project/config/workflow.js');
    const isConfigDefined = exists(configPath);

    if (!isConfigDefined) {
      Logger.warn(`Missing ${chalk.blue('project/config/workflow')}. Using defaults.`);
    } else {
      developerConfig = file(configPath);
    }

    _.merge(this.configuration, developerConfig);

    // Merge in CLI overrides.  The command line args can pass nested propertes like:
    //
    //    start --development.mode=angular --ekko.port=8000
    //
    // Yargs will convert those arguement into an object.  We pluck the only the top level attributes that we
    // are interested in and merge into the default configuration.
    //
    const cliConfig = {
      development: yargs.argv.development,
      ekko: yargs.argv.ekko
    };
    _.merge(this.configuration, cliConfig);

    console.log('hi');
    const message = `${this.configuration.development.mode.toUpperCase()} MODE`;
    Logger.info(`${chalk.bold.blue(message)}`);

    return this.configuration;

  },

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

    const hasLocalTemplate = exists(path.join(this.app(), templatePath));
    templatePath = hasLocalTemplate ? templatePath : path.relative(this.app(), path.join(__dirname, '../webpack', templatePath));
    const name = path.basename(templatePath);

    if (!hasLocalTemplate && !this.isTesting()) {
      Logger.warn(`Using ${chalk.blue('availity-workflow/webpack/' + name)}`);
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
    return this.config().development.mode === 'angular';
  },

  isReact() {
    return this.config().development.mode === 'react';
  },

  // Uses globby which defaults to process.cwd() and path.resolve(options.cwd, "/")
  js() {
    return [
      '**/**.js',
      '!node_modules/**',
      '!coverage/**',
      '!bower_components/**',
      '!dist/**',
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
