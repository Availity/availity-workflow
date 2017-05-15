const chalk = require('chalk');
const merge = require('lodash.merge');
const typeIs = require('type-is');
const path = require('path');
const get = require('lodash.get');
const Logger = require('availity-workflow-logger');
const escapeStringRegexp = require('escape-string-regexp');
const settings = require('availity-workflow-settings');

// Clean up HPM messages so they appear more availity-workflow like ;)
function proxyLogRewrite(daArgs) {

  const args = Array.prototype.slice.call(daArgs);

  return args.map(arg => {
    if (typeof arg === 'string') {
      return arg
      .replace(/\[HPM\] /g, '')
      .replace(/  /g, ' ');
    }
  });

}


function onRequest(proxyConfig, proxyObject) {

  if (!get(proxyConfig, 'contextRewrite', true)) {
    return;
  }

  const port = settings.port();
  const host = settings.host();

  const local = `http://${host}:${port}`;
  const target = proxyConfig.target;

  const regexer = new RegExp(escapeStringRegexp(local, 'g'));

  ['referer'].forEach(header => {

    const requestHeader = proxyObject.getHeader(header);
    if (requestHeader) {
      proxyObject.setHeader(header, requestHeader.replace(regexer, target));
    }

  });

}

function onResponse(proxyConfig, proxyObject, req, res) {

  if (!get(proxyConfig, 'contextRewrite', true)) {
    return;
  }

  const port = settings.port();
  const host = settings.host();

  const local = path.posix.join(`http://${host}:${port}`, proxyConfig.context);
  const target = proxyConfig.target;
  const regexer = new RegExp(escapeStringRegexp(target, 'g'));

  ['location'].forEach(header => {

    const responseHeader = proxyObject.headers[header];
    if (responseHeader) {
      proxyObject.headers[header] = responseHeader.replace(regexer, local);
    }

  });

  const isJson = typeIs.is(proxyObject.headers['content-type'], ['json']) === 'json';
  if (isJson) {

    delete proxyObject.headers['content-length'];
    const buffer = [];

    const _write = res.write;
    const _end = res.end;

    res.write = (chunk) => {
      buffer.push(chunk);
    };

    res.end = () => {

      let text = buffer.toString('utf8');
      text = text.replace(regexer, local);

      const body = new Buffer(text);

      _write.call(res, body);
      _end.call(res);

    };

  }

}

// https://github.com/chimurai/http-proxy-middleware/tree/master/recipes
function proxy() {

  const defaultProxy = {
    changeOrigin: true,
    ws: true,
    logLevel: 'info',
    xfwd: true,
    logProvider() {
      return {
        log() {
          Logger.log(proxyLogRewrite(arguments));
        },
        debug() {
          Logger.debug(proxyLogRewrite(arguments));
        },
        info() {
          Logger.info(proxyLogRewrite(arguments));
        },
        warn() {
          Logger.warn(proxyLogRewrite(arguments));
        },
        error() {
          Logger.error(proxyLogRewrite(arguments));
        }
      };
    }
  };

  const proxies = settings.configuration.proxies;

  if (!proxies) {
    return null;
  }

  const config = [];

  // Iterate through each proxy configuration
  proxies.forEach(proxyConfiguration => {

    // Merge in defaults including custom Logger and custom request/response function
    const proxyConfig = merge(defaultProxy, proxyConfiguration, {

      onProxyReq: (proxyReq, req) => {
        onRequest(proxyConfiguration, proxyReq, req);
      },

      onProxyRes: (proxyRes, req, res) => {
        onResponse(proxyConfiguration, proxyRes, req, res);
      }

    });

    // Only create proxy if enabled
    if (proxyConfig.enabled) {
      config.push(proxyConfig);
    } else {
      Logger.info(`Proxy with context: ${chalk.dim(proxyConfig.context)} and target: ${chalk.dim(proxyConfig.target)} is ${chalk.magenta('DISABLED')}`);
    }
  });

  // return null if the array is 0 to make the checks easier upstream
  return config.length === 0 ? null : config;

}

module.exports = proxy;
