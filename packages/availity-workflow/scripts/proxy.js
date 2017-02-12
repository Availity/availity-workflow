const chalk = require('chalk');
const merge = require('lodash.merge');
const Logger = require('availity-workflow-logger');
const settings = require('availity-workflow-settings');

// Clean up HPM messages
function message(arg) {

  if (typeof arg === 'string') {
    return arg
    .replace(/\[HPM\] /g, '')
    .replace(/  /g, ' ');
  }

  return arg;

}

function proxy() {

  let config = null;

  const defaultProxy = {
    changeOrigin: true,
    ws: true,
    logProvider() {
      return {
        log() {
          Logger.log(Array.prototype.slice.call(arguments));
        },
        debug() {
          Logger.info(Array.prototype.slice.call(arguments));
        },
        info() {
          let args = Array.prototype.slice.call(arguments);
          args = args.map(arg => message(arg));
          Logger.info(args);
        },
        warn() {
          Logger.warn(Array.prototype.slice.call(arguments));
        },
        error() {
          Logger.error(Array.prototype.slice.call(arguments));
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
