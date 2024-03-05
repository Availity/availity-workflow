import _ from 'lodash';
import chalk from 'chalk';

const logger = import('../logger').then(getInstance());

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

   */

  defaultConfig(path) {
    return this.path ? import(path) : this;
  }

  /**
   * Sets the configuration object from the configuration file and command line overrides.
   *
   * @param {Object} options configuration object with production|development|testing settings.
   */
  set(_options) {
    const options = _options || {};

    logger.setProvider(options.logProvider);

    // Get the config object by path or from root
    if (this.path) {
      logger.info(`Using ${chalk.blue(this.path)}`);
    }
    let config = this.path ? import(this.path) : this.defaultConfig();

    // Allow programmatic overrides for environment
    config = _.merge(config, options);

    // Save to `this.options`
    this.options = config;
  }
}

export default new Configuration();
