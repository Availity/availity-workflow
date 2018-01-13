function config(config) {
  const proxyTo = 'https://qa-apps.availity.com';

  const proxies = [
    {
      contextRewrite: false,
      context: ['/api', '/public', '/availity', '/web', '/ms'],
      pathRewrite: { '^/api': '/api' },
      target: proxyTo,
      enabled: true,
      logLevel: 'debug',
      xfwd: false,
      secure: false,
      changeOrigin: true,
      autoRewrite: true,
      onProxyReq: pReq => {
        pReq.setHeader('referer', proxyTo);
      },
      onProxyRes: pRes => {
        if (pRes.headers['set-cookie']) {
          pRes.headers['set-cookie'] = pRes.headers['set-cookie'].map(cookie =>
            cookie.replace(/secure;?/i, '')
          );
        }
        if (pRes.headers.location) {
          pRes.headers.location = pRes.headers.location.replace(
            proxyTo,
            `http://localhost:3000`
          );
        }
      },
      cookieDomainRewrite: '',
    },
  ];

  config.proxies = proxies;
  return config;
}

module.exports = config;
