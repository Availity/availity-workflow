import chalk from 'chalk';
import Debug from 'debug';
import Logger from '@availity/workflow-logger';
import deepMerge from '../helpers/deep-merge.js';

function escapeRegExp(s) {
  return s.replaceAll(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}

const debug = Debug('workflow:proxy');

function proxyLogRewrite(args) {
  return [...args].map((arg) => {
    if (typeof arg === 'string') {
      return arg.replaceAll('[HPM] ', '').replaceAll('  ', ' ');
    }
    return arg;
  });
}

function onRequest(s, proxyConfig, proxyObject) {
  if (!(proxyConfig?.contextRewrite ?? true)) {
    return;
  }

  const port = s.port();
  const host = s.host();

  const local = `http://${host}:${port}`;
  const { target } = proxyConfig;

  const regexer = new RegExp(escapeRegExp(local), 'g');

  for (const header of ['referer', 'origin']) {
    const requestHeader = proxyObject.getHeader(header);
    if (requestHeader) {
      const replacedHeader = requestHeader.replace(regexer, target);
      proxyObject.setHeader(header, replacedHeader);
      debug(`Rewriting ${header} header from ${requestHeader} to ${replacedHeader}`);
    }
  }
}

function onResponse(s, proxyConfig, proxyObject) {
  if (!(proxyConfig?.contextRewrite ?? true)) {
    return;
  }

  const port = s.port();
  const host = s.host();

  const hostUrl = `http://${host}:${port}`;

  const proxyContext = Array.isArray(proxyConfig.context) ? proxyConfig.context[0] : proxyConfig.context;
  const hostUrlContext = new URL(proxyContext, `http://${host}:${port}`).href;
  const targetUrl = proxyConfig.target;
  const targetUrlContext = new URL(proxyContext, proxyConfig.target).href;

  const regexer = new RegExp(escapeRegExp(targetUrl), 'g');
  const regexerContext = new RegExp(escapeRegExp(targetUrlContext));

  const responseHeader = proxyObject.headers.location;
  if (responseHeader) {
    const replacedUrl = regexerContext.test(responseHeader) ? hostUrl : hostUrlContext;
    const replacedHeader = responseHeader.replace(regexer, replacedUrl);
    debug(`Rewriting location header from ${chalk.blue(responseHeader)} to ${chalk.blue(replacedHeader)}`);
    proxyObject.headers.location = replacedHeader;
  }
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

function proxy(settings) {
  const defaultProxy = {
    changeOrigin: true,
    ws: true,
    logLevel: 'info',
    xfwd: true,
    logProvider() {
      return {
        log(...args) { Logger.log(proxyLogRewrite(args)); },
        debug(...args) { Logger.debug(proxyLogRewrite(args)); },
        info(...args) { Logger.info(proxyLogRewrite(args)); },
        warn(...args) { Logger.warn(proxyLogRewrite(args)); },
        error(...args) { Logger.error(proxyLogRewrite(args)); },
      };
    }
  };

  const { proxies } = settings.configuration;

  if (!proxies) {
    return null;
  }

  const config = [];

  for (const proxyConfiguration of proxies) {
    const proxyConfig = deepMerge({}, defaultProxy, proxyConfiguration, {
      onProxyReq: (proxyReq, req) => {
        onRequest(settings, proxyConfiguration, proxyReq, req);
        if (typeof proxyConfiguration.onProxyReq === 'function') {
          proxyConfiguration.onProxyReq(proxyReq, req);
        }
      },

      onProxyRes: (proxyRes, req, res) => {
        onResponse(settings, proxyConfiguration, proxyRes, req, res);
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

    if (proxyConfig.enabled) {
      config.push(proxyConfig);
    } else {
      const proxyContext = Array.isArray(proxyConfig.context) ? proxyConfig.context[0] : proxyConfig.context;
      Logger.info(
        `Proxy with context: ${chalk.dim(proxyContext)} and target: ${chalk.dim(proxyConfig.target)} is ${chalk.magenta(
          'DISABLED'
        )}`
      );
    }
  }

  return config.length === 0 ? null : config;
}

export default proxy;
