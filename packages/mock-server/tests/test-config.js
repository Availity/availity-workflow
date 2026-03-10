import path from 'path';

const config = {
  latency: 0,
  user: null,
  cache: 0,
  limit: '50mb',
  port: 0,
  host: '127.0.0.1', // 0.0.0.0 or localhost causes windows tests to fail?

  data: path.join(import.meta.dirname, '/data'),
  routes: path.join(import.meta.dirname, '/dummy.routes.config.json')
};

export default config;
