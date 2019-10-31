const chalk = require('chalk');
const debug = require('debug')('workflow:proxy');
const { get, merge } = require('lodash');
const urlJoin = require('url-join');
const Logger = require('@availity/workflow-logger');
const escapeStringRegexp = require('escape-string-regexp');
const settings = require('../settings');

// Clean up HPM messages so they appear more @availity/workflow like ;)
function proxyLogRewrite(daArgs) {
  const args = Array.prototype.slice.call(daArgs);

  return args.map(arg => {
    if (typeof arg === 'string') {
      return arg.replace(/\[HPM\] /g, '').replace(/ {2}/g, ' ');
    }

    return arg;
  });
}

function onRequest(proxyConfig, proxyObject) {
  if (!get(proxyConfig, 'contextRewrite', true)) {
    return;
  }

  const port = settings.port();
  const host = settings.host();

  const local = `http://${host}:${port}`;
  const { target } = proxyConfig;

  const regexer = new RegExp(escapeStringRegexp(local, 'g'));

  ['referer', 'origin'].forEach(header => {
    const requestHeader = proxyObject.getHeader(header);
    if (requestHeader) {
      const replacedHeader = requestHeader.replace(regexer, target);
      proxyObject.setHeader(header, replacedHeader);
      debug(`Rewriting ${header} header from ${requestHeader} to ${replacedHeader}`);
    }
  });
}

function onResponse(proxyConfig, proxyObject) {
  if (!get(proxyConfig, 'contextRewrite', true)) {
    return;
  }

  const port = settings.port();
  const host = settings.host();

  // http://localhost:3000
  const hostUrl = `http://${host}:${port}`;

  const proxyContext = Array.isArray(proxyConfig.context) ? proxyConfig.context[0] : proxyConfig.context;
  // http://localhost:3000/api
  const hostUrlContext = urlJoin(`http://${host}:${port}`, proxyContext);
  // http://localhost:8080
  const targetUrl = proxyConfig.target;
  // http://localhost:8080/api
  const targetUrlContext = urlJoin(proxyConfig.target, proxyContext);

  const regexer = new RegExp(escapeStringRegexp(targetUrl, 'g'));
  const regexerContext = new RegExp(escapeStringRegexp(targetUrlContext, 'g'));

  ['location'].forEach(header => {
    const responseHeader = proxyObject.headers[header];
    if (responseHeader) {
      const replacedUrl = regexerContext.test(responseHeader) ? hostUrl : hostUrlContext;
      const replacedHeader = responseHeader.replace(regexer, replacedUrl);
      debug(`Rewriting ${header} header from ${chalk.blue(responseHeader)} to ${chalk.blue(replacedHeader)}`);
      proxyObject.headers[header] = replacedHeader;
    }
  });

  // Below code never worked as the content length also had to be modified before gzipping back to UI.
  // This middleware didn't update the content length. Leaving this out unless in the future we have
  // urls we want to rewrite to our localhost that isn't using ekko

  // const isJson = typeIs.is(proxyObject.headers['content-type'], ['json']) === 'json';
  // if (isJson && proxyObject.statusCode !== 304) {
  //   proxyJson(res, proxyObject.headers['content-encoding'], body => {
  //     if (body) {
  //       const json = JSON.stringify(body);
  //       const replacedUrl = regexerContext.test(json) ? hostUrl : hostUrlContext;
  //       const replacedJson = json.replace(regexer, replacedUrl);
  //       debug(`Rewriting response body urls to ${chalk.blue(replacedUrl)} for request ${chalk.blue(req.url)}`);
  //       body = JSON.parse(replacedJson);
  //     }

  //     return body;
  //   });
  // }
}

function onProxyError(proxyConfiguration, err, req, res) {
  const host = req.headers && req.headers.host;
  Logger.error(
    `Proxy error: Could not proxy request ${chalk.cyan(req.url)} from ${chalk.cyan(host)} to ${chalk.cyan(
      proxyConfiguration.target
    )}`
  );
  if (res.writeHead && !res.headersSent) {
    res.writeHead(500);
  }
  res.end(`Proxy error: Could not proxy request ${req.url} from ${host} to ${proxyConfiguration.target}`);
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
        log(...args) {
          Logger.log(proxyLogRewrite(args));
        },
        debug(...args) {
          Logger.debug(proxyLogRewrite(args));
        },
        info(...args) {
          Logger.info(proxyLogRewrite(args));
        },
        warn(...args) {
          Logger.warn(proxyLogRewrite(args));
        },
        error(...args) {
          Logger.error(proxyLogRewrite(args));
        }
      };
    }
  };

  const { proxies } = settings.configuration;

  if (!proxies) {
    return null;
  }

  const config = [];

  // Iterate through each proxy configuration
  proxies.forEach(proxyConfiguration => {
    // Merge in defaults including custom Logger and custom request/response function
    const proxyConfig = merge({}, defaultProxy, proxyConfiguration, {
      onProxyReq: (proxyReq, req) => {
        onRequest(proxyConfiguration, proxyReq, req);
        if (typeof proxyConfiguration.onProxyReq === 'function') {
          proxyConfiguration.onProxyReq(proxyReq, req);
        }
      },

      onProxyRes: (proxyRes, req, res) => {
        onResponse(proxyConfiguration, proxyRes, req, res);
        if (typeof proxyConfiguration.onProxyRes === 'function') {
          proxyConfiguration.onProxyRes(proxyRes, req, res);
        }
      },

      onError: (err, req, res) => {
        onProxyError(proxyConfiguration, err, req, res);
        if (typeof proxyConfiguration.onError === 'function') {
          proxyConfiguration.onError(err, req, res);
        }
      }
    });

    const proxyContext = Array.isArray(proxyConfig.context) ? proxyConfig.context[0] : proxyConfig.context;

    // Only create proxy if enabled
    if (proxyConfig.enabled) {
      config.push(proxyConfig);
    } else {
      Logger.info(
        `Proxy with context: ${chalk.dim(proxyContext)} and target: ${chalk.dim(proxyConfig.target)} is ${chalk.magenta(
          'DISABLED'
        )}`
      );
    }
  });

  // return null if the array is 0 to make the checks easier upstream
  return config.length === 0 ? null : config;
}

module.exports = proxy;
