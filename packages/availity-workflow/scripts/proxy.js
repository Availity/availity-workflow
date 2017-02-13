const chalk = require('chalk');
const merge = require('lodash.merge');
const Logger = require('availity-workflow-logger');
const settings = require('availity-workflow-settings');

// Clean up HPM messages so they appear more availity-workflow like ;)
function message(daArgs) {

  const args = Array.prototype.slice.call(daArgs);

  return args.map(arg => {
    if (typeof arg === 'string') {
      return arg
      .replace(/\[HPM\] /g, '')
      .replace(/  /g, ' ');
    }
  });

}

// https://github.com/chimurai/http-proxy-middleware/tree/master/recipes
function proxy() {

  let config = null;

  const defaultProxy = {
    changeOrigin: true,
    ws: true,
    logLevel: 'info',
    logProvider() {
      return {
        log() {
          Logger.log(message(arguments));
        },
        debug() {
          Logger.debug(message(arguments));
        },
        info() {
          Logger.info(message(arguments));
        },
        warn() {
          Logger.warn(message(arguments));
        },
        error() {
          Logger.error(message(arguments));
        }
      };
    }
  };

  const proxies = settings.configuration.proxies;

  if (proxies) {
    config = [];
    // Iterate through each proxy configuration
    proxies.forEach(proxyConfiguration => {
      // Merge in defaults including custom Logger
      const proxyConfig = merge({}, proxyConfiguration, defaultProxy);
      // Only create proxy if enabled
      if (proxyConfig.enabled) {
        config.push(proxyConfig);
      } else {
        Logger.info(`Proxy with context: ${chalk.dim(proxyConfig.context)} and target: ${chalk.dim(proxyConfig.target)} is ${chalk.magenta('DISABLED')}`);
      }
    });

    // return null if the array is 0 to make the checks easier upstream
    config = config.length === 0 ? null : config;

  }

  return config;

}

module.exports = proxy;
