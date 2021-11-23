/* eslint-disable import/no-dynamic-require */
const path = require('path');
const Logger = require('@availity/workflow-logger');
const { existsSync } = require('fs');
const each = require('lodash/forEach');
const get = require('lodash/get');
const isFunction = require('lodash/isFunction');
const isObject = require('lodash/isObject');
const isString = require('lodash/isString');
const merge = require('lodash/merge');
const trimStart = require('lodash/trimStart');
const chalk = require('chalk');
const fs = require('fs');
const yargs = require('yargs');
const getPort = require('get-port');
const Joi = require('joi');
const paths = require('../helpers/paths');

function argv() {
  return yargs.argv;
}

function stringify(obj) {
  each(obj, (value, key) => {
    if (isString(value)) {
      try {
        JSON.parse(value);
        obj[key] = value;
      } catch {
        obj[key] = JSON.stringify(value);
      }
    } else if (isObject(value) && !isFunction(value)) {
      stringify(value);
    }
  });
  return obj;
}

const settings = {
  // Cache these values
  configuration: null,
  workflowConfigPath: null,
  devServerPort: null,
  ekkoServerPort: null,

  app() {
    return paths.app;
  },

  include() {
    // Allow developers to add their own node_modules include path
    const userInclude = this.configuration.development.babelInclude;
    const includes = ['@av', ...userInclude].join('|');
    const regex = new RegExp(`node_modules[/\\\\](?=(${includes})).*`);
    return [this.app(), regex];
  },

  // https://webpack.js.org/configuration/devtool/
  sourceMap() {
    // Get sourcemap from command line or developer config else "source-map"
    const sourceMap = get(this.configuration, 'development.sourceMap', 'cheap-module-source-map');

    return this.isDistribution() || this.isDryRun() ? 'source-map' : sourceMap;
  },

  coverage() {
    return get(this.configuration, 'development.coverage', path.join(this.project(), 'coverage'));
  },

  css() {
    return this.isProduction() ? '[name]-[contenthash:8].chunk.css' : '[name].chunk.css';
  },

  // Returns the JSON object from contents or the JSON object from
  // the project root
  pkg(contents) {
    if (contents) {
      return JSON.parse(contents || this.raw());
    }

    return require(path.join(this.project(), 'package.json'));
  },

  // [contenthash] generates unique hashes depending on the file contents
  // If the contents of a file don't change, the file should be cached in the browser.
  // https://webpack.js.org/guides/caching/#output-filenames
  fileName() {
    return this.isProduction() ? '[name]-[contenthash:8].chunk.js' : '[name].js';
  },

  chunkFileName() {
    return this.isProduction() ? '[name]-[contenthash:8].chunk.js' : '[name].chunk.js';
  },

  output() {
    return this.isDistribution() ? path.join(this.project(), 'dist') : path.join(this.project(), 'build');
  },

  port() {
    return this.devServerPort;
  },

  host() {
    return get(this.configuration, 'development.host', '0.0.0.0');
  },

  ekkoPort() {
    return this.ekkoServerPort;
  },

  open() {
    return get(this.configuration, 'development.open');
  },

  developmentTargets() {
    const defaultTargets = 'browserslist: last 1 chrome version, last 1 firefox version, last 1 safari version';
    const { browserslist } = this.pkg();

    const developmentTargets = get(this.configuration, 'development.targets', defaultTargets);

    // If project has a browserslist entry, webpack will use that as its development target
    // https://webpack.js.org/configuration/target/#target
    return browserslist ? 'browserslist' : developmentTargets;
  },

  globals() {
    const configGlobals = stringify(get(this.configuration, 'globals', {}));

    const env = this.environment();

    // - Read environment variables from command line
    // - Filter out variables that have not been declared in workflow config
    // - Apply environment variables to the default config
    // - Map "staging" to "production" for process.env so that React deploys without extra debugging
    //   capabilities
    const parsedGlobals = Object.keys(process.env)
      .filter((key) => key in configGlobals)
      // eslint-disable-next-line unicorn/no-reduce
      .reduce(
        (result, key) => {
          result[key] = JSON.stringify(process.env[key]);
          return result;
        },
        {
          'process.env.NODE_ENV': JSON.stringify(env === 'staging' ? 'production' : env),
          __TEST__: env === 'test',
          __DEV__: env === 'development',
          __PROD__: env === 'production',
          __STAGING__: env === 'staging'
        }
      );

    return merge(configGlobals, parsedGlobals);
  },

  project() {
    return paths.project;
  },

  version() {
    return this.pkg().version || 'N/A';
  },

  browsers() {
    return this.configuration.testing.browsers;
  },

  title() {
    return get(this.configuration, 'app.title', 'Availity');
  },

  log() {
    Logger.warn(chalk.bold.yellow('REACT'));

    if (!this.isTesting()) {
      Logger.info(
        `Using ${chalk.blue(trimStart(path.relative(process.cwd(), this.workflowConfigPath), 'node_modules/'))}`
      );
    }
  },

  statsLogLevel() {
    const level = get(this.configuration, 'development.stats.level', 'normal');
    return get(argv(), 'development.stats.level', level);
  },

  infrastructureLogLevel() {
    const level = get(this.configuration, 'development.infrastructureLogging.level', 'info');
    return get(argv(), 'development.infrastructureLogging.level', level);
  },

  async init({ shouldMimicStaging } = {}) {
    let config = {};
    const schema = require('./schema');
    let developerConfig = {};

    this.shouldMimicStaging = shouldMimicStaging;

    const { value: defaultConfig } = schema.validate({});

    const defaultWorkflowConfig = path.join(__dirname, 'schema.js');
    const jsWorkflowConfig = path.join(settings.project(), 'project/config/workflow.js');

    if (existsSync(jsWorkflowConfig)) {
      // Try project's workflow.js
      this.workflowConfigPath = jsWorkflowConfig;
      developerConfig = require(this.workflowConfigPath);
    } else {
      // fall back to default ./schema.js
      this.workflowConfigPath = defaultWorkflowConfig;
    }

    // Merge in ./schema.js defaults with overrides from developer config
    if (typeof developerConfig === 'function') {
      config = developerConfig(defaultConfig);
    } else {
      merge(config, defaultConfig, this.pkg().availityWorkflow, developerConfig);
    }

    // Validate workflow.js settings
    try {
      Joi.assert(config, schema);
      this.configuration = config;
    } catch (error) {
      const details = JSON.stringify(error.details, null, 2);
      const message = `Your workflow.js settings are invalid. See details below:\n${details}`;
      Logger.failed(message);
      throw error;
    }

    // Merge in CLI overrides.  The command line args can pass nested properties like:
    //
    //    start --development.port=3000 --ekko.port=9999
    //
    // Yargs will convert those arguments into an object.  We pluck the only the top level attributes that we
    // are interested in and merge into the default configuration.
    //
    const args = argv();
    merge(this.configuration, {
      development: args.development,
      ekko: args.ekko,
      globals: args.globals
    });

    this.globals();

    this.devServerPort = get(this.configuration, 'development.port', 3000);
    const availablePort = await getPort({
      port: getPort.makeRange(this.devServerPort, this.devServerPort + 1000),
      host: this.host()
    });

    if (availablePort !== this.devServerPort) {
      this.devServerPort = availablePort;
    }

    const wantedEkkoPort = get(this.configuration, 'ekko.port', 9999);
    this.ekkoServerPort = await getPort({
      port: getPort.makeRange(wantedEkkoPort, wantedEkkoPort + 1000),
      host: this.host()
    });
    if (wantedEkkoPort !== this.ekkoServerPort) {
      this.configuration.ekko.pluginContext = this.configuration.ekko.pluginContext.replace(
        `:${wantedEkkoPort}`,
        `:${this.ekkoServerPort}`
      );
      if (Array.isArray(this.configuration.proxies)) {
        for (const proxy of this.configuration.proxies) {
          proxy.target = proxy.target.replace(`:${wantedEkkoPort}`, `:${this.ekkoServerPort}`);
        }
      }
    }
  },

  raw() {
    if (!this.raw) {
      this.raw = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8');
    }

    return this.raw;
  },

  asset(workflowFilePath, projectFilePath) {
    const hasProjectFile = fs.existsSync(projectFilePath);
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
    if (process.env.NODE_ENV) {
      return process.env.NODE_ENV;
    }

    process.env.NODE_ENV = 'development';
    return process.env.NODE_ENV;
  },

  // Uses globby which defaults to process.cwd() and path.resolve(options.cwd, "/")
  js() {
    let includeGlobs = argv().include;

    const defaultInclude = [
      `${this.app()}/**/*.js`,
      `${this.app()}/**/*.jsx`,
      `${this.app()}/**/*.ts`,
      `${this.app()}/**/*.tsx`
    ];

    if (!includeGlobs || !Array.isArray(includeGlobs) || includeGlobs.length === 0) {
      includeGlobs = defaultInclude;
    }

    // eslint-disable-next-line unicorn/prefer-spread
    return includeGlobs.concat(includeGlobs); // FIXME: should probably be [...default, ...includeGlobs]
  },

  isDryRun() {
    return argv().dryRun !== undefined;
  },

  isOptimized() {
    return argv().optimize === undefined;
  },

  isStaging() {
    return this.environment() === 'staging' || this.shouldMimicStaging;
  },

  isIntegration() {
    return this.environment() === 'integration';
  },

  isNotifications() {
    return get(this.configuration, 'development.notification', true);
  },

  isDevelopment() {
    return this.environment() === 'development';
  },

  isTesting() {
    return this.environment() === 'test';
  },

  isIgnoreUntracked() {
    return argv().ignoreGitUntracked !== undefined;
  },

  isWatch() {
    return argv().watch !== undefined;
  },

  isIntegrationTesting() {
    return argv().integration !== undefined;
  },

  isProduction() {
    return argv().production || this.environment() === 'production';
  },

  isDistribution() {
    return this.isProduction() || this.isStaging();
  },

  isCoverage() {
    return argv().coverage !== undefined;
  },

  isFail() {
    return argv().fail !== undefined;
  },

  isProfile() {
    return argv().profile !== undefined;
  },

  historyFallback() {
    return get(this.configuration, 'development.historyFallback', true);
  },

  isLinterDisabled() {
    return argv().disableLinter !== undefined;
  },

  enableHotLoader() {
    const isHot = get(this.configuration, 'development.hotLoader', true);

    if (typeof isHot === 'object') {
      return isHot.enabled || false;
    }

    return isHot;
  },

  getHotLoaderName() {
    return 'react-refresh/babel';
  },

  getHotLoaderEntry() {
    return get(this.configuration, 'development.hotLoaderEntry', /\/App\.jsx?/);
  },

  isEkko() {
    return get(this.configuration, 'ekko.enabled', true);
  },

  commitMessage() {
    return argv().message;
  },

  // webpack docs default experiments to false, but that causes build errors
  experimentalWebpackFeatures() {
    return get(this.configuration, 'experiments', {});
  }
};

module.exports = settings;
