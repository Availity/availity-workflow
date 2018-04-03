const config = require('../config');

module.exports = function headers() {
  config.app.disable('x-powered-by');
  config.app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'Availity Mock Server');
    next();
  });
};
