function config(config) {
  const proxyTo = 'http://localhost:5050';
  config.development.port = 3000;
  config.development.open = '/#/?spaceId=73162546201441126239486200007187';

  config.ekko.port = 0;

  const proxies = [
    {
      context: ['/api', '/public', '/availity', '/web', '/ms', '/static'],
      target: proxyTo,
      enabled: true,
    },
  ];

  config.proxies = proxies;

  return config;
}

module.exports = config;
