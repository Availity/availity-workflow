import chalk from 'chalk';
import deepMerge from '../helpers/deep-merge.js';
import logger from '../logger/index.js';

const log = logger.getInstance();

class Configuration {
  constructor() {
    this.server = null;
    this.app = null;
    this.router = null;
    this.routes = [];
    this.cache = [];
    this.path = null;
    this.addressInUse = null;
  }

  /**
   * Set the path of the configuration object
   *
   * @param  {Sring} path full path to configuration. Ex: path.join(__dirname, 'config.js')
   *
   */

  async defaultConfig(path) {
    if (this.path) {
      const mod = await import(path);
      return mod.default;
    }
    return this;
  }

  /**
   * Sets the configuration object from the configuration file and command line overrides.
   *
   * @param {Object} options configuration object with production|development|testing settings.
   */
  async set(_options) {
    const options = _options || {};

    log.setProvider(options.logProvider);

    // Get the config object by path or from root
    if (this.path) {
      log.info(`Using ${chalk.blue(this.path)}`);
    }
    let config;
    if (this.path) {
      const mod = await import(this.path);
      config = mod.default;
    } else {
      config = await this.defaultConfig();
    }

    // Allow programmatic overrides for environment
    config = deepMerge(config, options);

    // Save to `this.options`
    this.options = config;
  }
}

export default new Configuration();
