const _ = require('lodash');
const chalk = require('chalk');
const logger = require('../logger').getInstance();

class Configuration {
  constructor() {
    this.server = null;
    this.app = null;
    this.router = null;
    this.routes = [];
    this.events = null;
    this.path = null;
    this.addressInUse = null;

    this.constants = {
      EVENTS: {
        START: 'av:started',
        STOPPED: 'av:stopped',
        REQUEST: 'av:request',
        RESPONSE: 'av:response',
        REDIRECT: 'av:redirect',
        FILE_NOT_FOUND: 'av:fileNotFound'
      }
    };
  }

  /**
   * Set the path of the configuration object
   *
   * @param  {Sring} path full path to configuration. Ex: path.join(__dirname, 'config.js')

   */

  defaultConfig(path) {
    return this.path ? require(path) : require('../config');
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
    let config = this.path ? require(this.path) : this.defaultConfig();

    // Allow programmatic overrides for environment
    config = _.merge(config, options);

    // Save to `this.options`
    this.options = config;
  }
}

module.exports = new Configuration();
