import _ from 'lodash';
import chalk from 'chalk';

import logger from '../logger';

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
   * @param  {String} path full path to configuration. Ex: path.join(__dirname, 'config.js')

   */

  async defaultConfig(path) {
    if (this.path) {
      const { default: json } = await import(path);
      return json;
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

    logger.getInstance().setProvider(options.logProvider);

    // Get the config object by path or from root
    if (this.path) {
      logger.getInstance().info(`Using ${chalk.blue(this.path)}`);
    }

    let config;

    if (this.path) {
      const { default: json } = await import(this.path);

      config = json;
    } else {
      config = await this.defaultConfig();
    }

    // let config = this.path ? await import(this.path, { assert: { type: "json" } }).default : this.defaultConfig();

    // Allow programmatic overrides for environment
    config = _.merge(config, options);

    // Save to `this.options`
    this.options = config;
  }
}

export default new Configuration();
