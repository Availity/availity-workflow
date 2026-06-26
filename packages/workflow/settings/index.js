import path from 'node:path';
import fs from 'node:fs';
import Logger from '@availity/workflow-logger';
import chalk from 'chalk';
import deepMerge from '../helpers/deep-merge.js';
import paths from '../helpers/paths.js';
import resolveConfig from './config.js';
import resolveRuntime from './runtime.js';

/** Recursively JSON.stringify string values that aren't already valid JSON (for webpack DefinePlugin). */
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
  // -- State --
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

  /**
   * Async factory — use this instead of new Settings().
   * @param {{ shouldMimicStaging?: boolean, argv?: object }} options
   * @returns {Promise<Settings>}
   */
  static async create({ shouldMimicStaging, argv = {} } = {}) {
    const instance = new Settings(argv);
    instance.shouldMimicStaging = shouldMimicStaging;

    await instance.loadPkg();

    const { configuration, workflowConfigPath } = await resolveConfig({
      pkg: instance.pkg(),
      argv: instance.argv(),
    });

    instance.configuration = configuration;
    instance.workflowConfigPath = workflowConfigPath;

    // Validate globals early
    try {
      instance.globals();
    } catch (error) {
      Logger.failed(`There was an error initializing globals. See details below:\n\n${error.message}`);
      throw error;
    }

    // Resolve ports
    const { devServerPort, ekkoServerPort } = await resolveRuntime(instance.configuration, instance.host());
    instance.devServerPort = devServerPort;
    instance.ekkoServerPort = ekkoServerPort;

    return instance;
  }

  // -- Path accessors --

  app() {
    return paths.app;
  }

  project() {
    return paths.project;
  }

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

  config() {
    return this.configuration;
  }

  title() {
    return this.configuration?.app?.title ?? 'Availity';
  }

  host() {
    return this.configuration?.development?.host ?? '0.0.0.0';
  }

  port() {
    return this.devServerPort;
  }

  ekkoPort() {
    return this.ekkoServerPort;
  }

  open() {
    return this.configuration?.development?.open;
  }

  historyFallback() {
    return this.configuration?.development?.historyFallback ?? true;
  }

  isNotifications() {
    return this.configuration?.development?.notification ?? true;
  }

  enableHotLoader() {
    const isHot = this.configuration?.development?.hotLoader ?? true;
    if (typeof isHot === 'object') return isHot.enabled || false;
    return isHot;
  }

  isEkko() {
    return this.configuration?.ekko?.enabled ?? true;
  }

  eslint() {
    return this.configuration.eslint;
  }

  experimentalWebpackFeatures() {
    return this.configuration?.experiments ?? {};
  }

  // -- Webpack helpers --

  include() {
    const userInclude = this.configuration.development.babelInclude;
    const includes = ['@av', ...userInclude].join('|');
    const regex = new RegExp(`node_modules[/\\\\](?=(${includes})).*`);
    return [this.app(), regex];
  }

  sourceMap() {
    const sourceMap = this.configuration?.development?.sourceMap ?? 'source-map';
    return this.isDistribution() || this.isDryRun() ? 'source-map' : sourceMap;
  }

  fileName() {
    return this.isProduction() ? '[name]-[contenthash:8].chunk.js' : '[name].js';
  }

  chunkFileName() {
    return this.isProduction() ? '[name]-[contenthash:8].chunk.js' : '[name].chunk.js';
  }

  developmentTargets() {
    const defaultTargets = 'browserslist: last 1 chrome version, last 1 firefox version, last 1 safari version';
    const { browserslist } = this.pkg();
    const developmentTargets = this.configuration?.development?.targets ?? defaultTargets;
    return browserslist ? 'browserslist' : developmentTargets;
  }

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

  statsLogLevel() {
    const level = this.configuration?.development?.stats?.level ?? 'normal';
    return this.argv()?.development?.stats?.level ?? level;
  }

  infrastructureLogLevel() {
    const level = this.configuration?.development?.infrastructureLogging?.level ?? 'normal';
    return this.argv()?.development?.infrastructureLogging?.level ?? level;
  }

  asset(workflowFilePath, projectFilePath) {
    const hasProjectFile = fs.existsSync(projectFilePath);
    const filePath = hasProjectFile ? projectFilePath : workflowFilePath;

    if (!this.isTesting()) {
      const message = path.relative(process.cwd(), filePath).replace(/^node_modules\//, '');
      Logger.info(`Using ${chalk.blue(message)}`);
    }

    return path.relative(this.app(), filePath);
  }

  // -- Environment --

  environment() {
    if (process.env.NODE_ENV) return process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    return process.env.NODE_ENV;
  }

  isDevelopment() {
    return this.environment() === 'development';
  }

  isTesting() {
    return this.environment() === 'test';
  }

  isProduction() {
    return this.argv().production || this.environment() === 'production';
  }

  isStaging() {
    return this.environment() === 'staging' || this.shouldMimicStaging;
  }

  isDistribution() {
    return this.isProduction() || this.isStaging();
  }

  // -- CLI flags --

  isDryRun() {
    return this.argv().dryRun !== undefined;
  }

  isProfile() {
    return this.argv().profile !== undefined;
  }

  isIgnoreUntracked() {
    return this.argv().ignoreGitUntracked !== undefined;
  }

  isLinterDisabled() {
    return this.argv().disableLinter !== undefined;
  }

  commitMessage() {
    return this.argv().message;
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
    Logger.warn(chalk.bold.yellow('REACT'));

    if (!this.isTesting()) {
      Logger.info(
        `Using ${chalk.blue(path.relative(process.cwd(), this.workflowConfigPath).replace(/^node_modules\//, ''))}`
      );
    }
  }
}
