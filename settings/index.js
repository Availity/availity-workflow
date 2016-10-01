'use strict';

const path = require('path');
const chalk = require('chalk');
const exists = require('exists-sync');
const yargs = require('yargs');
const yaml = require('js-yaml');
const fs = require('fs');
const _ = require('lodash');

const Logger = require('../logger');
const file = require('../dev/file');

const settings = {

  raw: null,
  configuration: null,
  isYaml: null,
  isConfigDefined: null,

  init() {

    this.configuration = require('./workflow');
    let developerConfig = {};

    // try workflow.js
    let configPath = path.join(settings.project(), '/project/config/workflow.js');
    this.isConfigDefined = exists(configPath);

    // try workflow.yml if worflow.js is not found
    this.isYaml = false;
    if (!this.isConfigDefined) {
      configPath = path.join(settings.project(), '/project/config/workflow.yml');
      this.isYaml = this.isConfigDefined = exists(configPath);
    }

    if (this.isConfigDefined) {
      developerConfig = this.isYaml ? yaml.safeLoad(fs.readFileSync(configPath, 'utf8')) : file(configPath);
    }

    _.merge(this.configuration, developerConfig);

    // Merge in CLI overrides.  The command line args can pass nested properties like:
    //
    //    start --development.mode=angular --ekko.port=8000
    //
    // Yargs will convert those arguments into an object.  We pluck the only the top level attributes that we
    // are interested in and merge into the default configuration.
    //
    _.merge(this.configuration, {
      development: yargs.argv.development,
      ekko: yargs.argv.ekko
    });

  },

  log() {

    // Log the mode
    const message = `${this.configuration.development.mode.toUpperCase()} MODE`;
    Logger.warn(`${chalk.bold.yellow(message)}`);

    // Log the config
    if (!this.isConfigDefined) {
      Logger.info(`Using ${chalk.blue('availity-workflow/settings/workflow.js')}`);
    } else {
      const extension = this.isYaml ? 'yml' : 'js';
      const configPathExtension = `./project/config/workflow.${extension}`;
      Logger.info(`Using ${chalk.blue(configPathExtension)}`);
    }

  },

  config() {

    if (!this.configuration) {
      this.init();
    }

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
      Logger.info(`Using ${chalk.blue('availity-workflow/webpack/' + name)}`);
    }


    return templatePath;

  },

  template() {
    return this.asset('./index.html');
  },

  historyFallback() {
    return this.configuration.historyFallback;
  },

  favicon() {
    return this.asset('./favicon.ico');
  },

  isEkko() {
    return this.configuration.ekko.enabled;
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
