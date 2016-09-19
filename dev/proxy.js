'use strict';
const _ = require('lodash');

const Logger = require('../logger');
const settings = require('../settings');

// function proxy(devServer) {

//   devServer.use(history({

//     // Allow paths with dots in them to be loaded, reference issue #387
//     disableDotRule: true,

//     // For single page apps, we generally want to fallback to /index.html.
//     // However we also want to respect `proxy` for API calls.
//     // So if `proxy` is specified, we need to decide which fallback to use.
//     // We use a heuristic: if request `accept`s text/html, we pick /index.html.
//     // Modern browsers include text/html into `accept` header when navigating.
//     // However API calls like `fetch()` won’t generally won’t accept text/html.
//     // If this heuristic doesn’t work well for you, don’t use `proxy`.
//     htmlAcceptHeaders: settings.configuration.proxies ?
//      ['text/html'] :
//      ['text/html', '*/*']

//   }));

//   const defaultProxy = {
//     changeOrigin: true,
//     ws: true,
//     logProvider() {
//       return {
//         log() {
//           Logger.log(Array.prototype.slice.call(arguments));
//         },
//         debug() {
//           Logger.info(Array.prototype.slice.call(arguments));
//         },
//         info() {
//           Logger.info(Array.prototype.slice.call(arguments));
//         },
//         warn() {
//           Logger.warn(Array.prototype.slice.call(arguments));
//         },
//         error() {
//           Logger.error(Array.prototype.slice.call(arguments));
//         }
//       };
//     }
//   };

//   const proxies = settings.configuration.proxies;
//   if (proxies) {
//     // Iterate through each proxy configuration
//     proxies.forEach(proxyConfiguration => {
//       // Merge in defaults including custom Logger
//       const proxyConfig = _.merge({}, proxyConfiguration, defaultProxy);
//       // Only create proxy if enabled
//       if (proxyConfig.enabled || false) {
//         devServer.use(proxyConfig.path, httpProxy(proxyConfig));
//       }
//     });
//   }

// }

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
          Logger.info(Array.prototype.slice.call(arguments));
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
      const proxyConfig = _.merge({}, proxyConfiguration, defaultProxy);
      // Only create proxy if enabled
      if (proxyConfig.enabled || false) {
        config.push(proxyConfig);
      }
    });

    // return null if the array is 0 to make the checks easier upstream
    config = config.length === 0 ? null : config;

  }

  return config;

}

module.exports = proxy;
