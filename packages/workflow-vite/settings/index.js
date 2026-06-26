import path from 'node:path';
import fs, { existsSync } from 'node:fs';
import Logger from '@availity/workflow-logger';
import chalk from 'chalk';
import getPort, { portNumbers } from 'get-port';
import Joi from 'joi';
import deepMerge from '../helpers/deep-merge.js';
import paths from '../helpers/paths.js';
import schema from './schema.js';

/** Recursively JSON.stringify string values that aren't already valid JSON (for Vite define). */
function stringifyValues(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      try {
        JSON.parse(value);
        result[key] = value;
      } catch {
        result[key] = JSON.stringify(value);
      }
    } else if (typeof value === 'object' && value !== null && typeof value !== 'function') {
      result[key] = stringifyValues(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

export default class Settings {
  configuration = null;

  workflowConfigPath = null;

  devServerPort = null;

  ekkoServerPort = null;

  shouldMimicStaging = false;

  _version = undefined;

  #pkg = null;

  #argv = null;

  constructor(argv = {}) {
    this.#argv = argv;
  }

  argv() {
    return this.#argv;
  }

  static async create({ shouldMimicStaging, argv = {} } = {}) {
    const instance = new Settings(argv);
    instance.shouldMimicStaging = shouldMimicStaging;

    await instance.loadPkg();

    let config = {};
    let developerConfig = {};

    const { value: defaultConfig } = schema.validate({});
    const defaultWorkflowConfig = path.join(import.meta.dirname, 'schema.js');
    const jsWorkflowConfig = path.join(paths.project, 'project/config/workflow.js');

    if (existsSync(jsWorkflowConfig)) {
      instance.workflowConfigPath = jsWorkflowConfig;
      const module = await import(jsWorkflowConfig);
      developerConfig = module.default || module;
    } else {
      instance.workflowConfigPath = defaultWorkflowConfig;
    }

    try {
      if (typeof developerConfig === 'function') {
        config = developerConfig(defaultConfig);
      } else {
        deepMerge(config, defaultConfig, instance.pkg().availityWorkflow, developerConfig);
      }
    } catch (error) {
      Logger.failed(`Error merging config:\n\n${error.message}`);
      throw error;
    }

    try {
      Joi.assert(config, schema);
      instance.configuration = config;
    } catch (error) {
      Logger.failed(`Invalid workflow.js settings:\n\n${JSON.stringify(error.details, null, 2)}`);
      throw error;
    }

    const args = instance.argv();
    deepMerge(instance.configuration, { development: args.development, ekko: args.ekko, globals: args.globals });

    // Validate globals
    try {
      instance.globals();
    } catch (error) {
      Logger.failed(`Error initializing globals:\n\n${error.message}`);
      throw error;
    }

    // Setup dev port
    instance.devServerPort = instance.configuration?.development?.port ?? 3000;
    const availablePort = await getPort({
      port: portNumbers(instance.devServerPort, instance.devServerPort + 1000),
      host: instance.host(),
    });
    if (availablePort !== instance.devServerPort) instance.devServerPort = availablePort;

    // Setup ekko port
    const wantedEkkoPort = instance.configuration?.ekko?.port ?? 9999;
    instance.ekkoServerPort = await getPort({
      port: portNumbers(wantedEkkoPort, wantedEkkoPort + 1000),
      host: instance.host(),
    });
    if (wantedEkkoPort !== instance.ekkoServerPort && Array.isArray(instance.configuration.proxies)) {
      for (const proxy of instance.configuration.proxies) {
        proxy.target = proxy.target.replace(`:${wantedEkkoPort}`, `:${instance.ekkoServerPort}`);
      }
    }

    return instance;
  }

  // -- Path accessors --

  app() { return paths.app; }

  project() { return paths.project; }

  output() {
    return this.isDistribution() ? path.join(this.project(), 'dist') : path.join(this.project(), 'build');
  }

  // -- Package --

  pkg() {
    if (!this.#pkg) {
      this.#pkg = JSON.parse(fs.readFileSync(path.join(this.project(), 'package.json'), 'utf8'));
    }
    return this.#pkg;
  }

  async loadPkg() {
    if (!this.#pkg) {
      const content = await fs.promises.readFile(path.join(this.project(), 'package.json'), 'utf8');
      this.#pkg = JSON.parse(content);
    }
    return this.#pkg;
  }

  // -- Config accessors --

  config() { return this.configuration; }

  title() { return this.configuration?.app?.title ?? 'Availity'; }

  host() { return this.configuration?.development?.host ?? '0.0.0.0'; }

  port() { return this.devServerPort; }

  ekkoPort() { return this.ekkoServerPort; }

  open() { return this.configuration?.development?.open; }

  isEkko() { return this.configuration?.ekko?.enabled ?? true; }

  isLinterDisabled() { return this.argv().disableLinter !== undefined; }

  isIgnoreUntracked() { return this.argv().ignoreGitUntracked !== undefined; }

  commitMessage() { return this.argv().message; }

  // -- Environment --

  environment() {
    if (process.env.NODE_ENV) return process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    return process.env.NODE_ENV;
  }

  isDevelopment() { return this.environment() === 'development'; }

  isTesting() { return this.environment() === 'test'; }

  isProduction() { return this.argv().production || this.environment() === 'production'; }

  isStaging() { return this.environment() === 'staging' || this.shouldMimicStaging; }

  isDistribution() { return this.isProduction() || this.isStaging(); }

  isDryRun() { return this.argv().dryRun !== undefined; }

  // -- Globals --

  globals() {
    const configGlobals = stringifyValues(this.configuration?.globals ?? {});
    const env = this.environment();
    const parsedGlobals = Object.keys(process.env)
      .filter((key) => key in configGlobals)
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
          __STAGING__: env === 'staging',
        }
      );
    return deepMerge(configGlobals, parsedGlobals);
  }

  // -- Lint file patterns --

  js() {
    const userInclude = this.argv().include;
    const defaultInclude = [
      `${this.app()}/**/*.js`,
      `${this.app()}/**/*.jsx`,
      `${this.app()}/**/*.ts`,
      `${this.app()}/**/*.tsx`,
    ];
    if (!userInclude || !Array.isArray(userInclude) || userInclude.length === 0) {
      return defaultInclude;
    }
    return [...defaultInclude, ...userInclude];
  }

  // -- Logging --

  log() {
    if (!this.isTesting()) {
      Logger.info(
        `Using ${chalk.blue(path.relative(process.cwd(), this.workflowConfigPath).replace(/^node_modules\//, ''))}`
      );
    }
  }
}
