const path = require('path');
const Logger = require('availity-workflow-logger');
const exists = require('exists-sync');
const trimStart = require('lodash.trimstart');
const chalk = require('chalk');
const merge = require('lodash.merge');
const fs = require('fs');
const yaml = require('js-yaml');
const get = require('lodash.get');
const argv = require('yargs').argv;


const settings = {

  // Cache these values
  configuration: null,
  workflowConfigPath: null,

  app() {
    return path.join(this.project(), 'project/app');
  },

  tool() {
    return this.isDistribution() ? 'eval' : 'cheap-module-source-map';
  },

  css() {
    return this.isDevelopment() ? '[name].css' : '[name]-[chunkhash].css';
  },

  // Returns the JSON object from contents or the JSON object from
  // the project root
  pkg(contents) {

    if (contents) {
      return JSON.parse(contents || this.raw());
    }

    return require(path.join(this.project(), 'package.json'));
  },

  // Don’t use [chunkhash] in development since this will increase compilation time
  // In production, [chunkhash] generate hashes depending on the file contents this if
  // the contents don't change the file could potentially be cached in the browser.
  fileName() {
    return this.isDevelopment() ? '[name].js' : '[name]-[chunkhash].js';
  },

  output() {
    return this.isDistribution() ?
      path.join(this.project(), 'dist') :
      path.join(this.project(), 'build');
  },

  port() {
    return this.configuration.development.port;
  },

  host() {
    return this.configuration.development.host;
  },

  open() {
    return this.configuration.development.open;
  },

  project() {
    return process.cwd();
  },

  log() {

    // Log the mode
    let message = `${this.pkg().availityWorkflow.plugin.split('availity-workflow-')[1].toUpperCase()} MODE`;
    Logger.warn(chalk.bold.yellow(message));

    if (!this.isTesting()) {
      message = trimStart(path.relative(process.cwd(), this.workflowConfigPath), 'node_modules/');
      Logger.info(`Using ${chalk.blue(message)}`);
    }

  },

  logLevel() {
    const level = get(this.configuration, 'development.logLevel', 'none');
    return get(argv, 'development.logLevel', level);
  },


  init() {
    this.configuration = require('./workflow');
    let developerConfig = {};

    const defaultWorkflowConfig = path.join(settings.project(), 'project/config/workflow.yml');
    const jsWorkflowConfig = path.join(settings.project(), 'project/config/workflow.js');
    const ymlWorkflowConfig = path.join(settings.project(), 'project/config/workflow.yml');

    if (exists(jsWorkflowConfig)) {         // Try workflow.js
      this.workflowConfigPath = jsWorkflowConfig;
      developerConfig = require(this.workflowConfigPath);

    } else if (exists(ymlWorkflowConfig)) { // Try workflow.yml
      this.workflowConfigPath = ymlWorkflowConfig;
      developerConfig = yaml.safeLoad(fs.readFileSync(this.workflowConfigPath, 'utf8'));

    } else {  // fall back to default workflow.js
      this.workflowConfigPath = defaultWorkflowConfig;
    }

    // Merge in ./workflow.js defaults with overrides from developer config
    merge(this.configuration, developerConfig);

    // Merge in CLI overrides.  The command line args can pass nested properties like:
    //
    //    start --development.port=3000 --ekko.port=9999
    //
    // Yargs will convert those arguments into an object.  We pluck the only the top level attributes that we
    // are interested in and merge into the default configuration.
    //
    merge(this.configuration, {
      development: argv.development,
      ekko: argv.ekko
    });

  },

  raw() {

    if (!this.raw) {
      this.raw = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8');
    }

    return this.raw;

  },

  asset(workflowFilePath, projectFilePath) {

    const hasProjectFile = exists(projectFilePath);
    const filePath = hasProjectFile ? projectFilePath : workflowFilePath;

    if (!this.isTesting()) {
      const message = trimStart(path.relative(process.cwd(), filePath), 'node_modules/');
      Logger.info(`Using ${chalk.blue(message)}`);
    }

    return path.relative(this.app(), filePath);

  },

  config() {
    return this.configuration;
  },

  environment() {
    return process.env.NODE_ENV || 'development';
  },

  // Uses globby which defaults to process.cwd() and path.resolve(options.cwd, "/")
  js() {

    let includeGlobs = argv.include;

    const defaultInclude = [
      `${this.app()}/**/*.js`,
      `${this.app()}/**/*.jsx`
    ];

    if (!includeGlobs || !Array.isArray(includeGlobs) || includeGlobs.length === 0) {
      includeGlobs = defaultInclude;
    }

    return includeGlobs.concat(includeGlobs);
  },

  isDryRun() {
    return argv.dryRun !== undefined;
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

  isNotifications() {
    return this.configuration.development.notification || false;
  },

  isDevelopment() {
    return this.environment() === 'development';
  },

  isTesting() {
    return this.environment() === 'testing' || this.environment() === 'test';
  },

  isProduction() {
    return this.environment() === 'production';
  },

  isDistribution() {
    return this.isProduction() || this.isStaging();
  },

  historyFallback() {
    return this.configuration.development.historyFallback || true;
  },

  isLinting() {
    return true;
  },

  isEkko() {
    return this.configuration.ekko.enabled;
  }

};

module.exports = settings;
