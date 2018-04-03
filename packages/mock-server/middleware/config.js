const errorhandler = require('errorhandler');
const compression = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');
const _ = require('lodash');
const onFinished = require('on-finished');
const chalk = require('chalk');

const config = require('../config');
const routes = require('../routes');
const logger = require('../logger').getInstance();

const requestHandler = require('./request');
const notFoundHandler = require('./not.found');

// Custom request logger
module.exports = function development() {
  if (logger.canLog()) {
    config.router.use((req, res, next) => {
      function logRequest() {
        const method = `${chalk.white(req.method)}`;
        const url = `${chalk.dim(req.originalUrl || req.url)}`;
        // eslint-disable-next-line no-underscore-dangle
        const code = res._header ? String(res.statusCode) : '';
        const file = chalk.dim(res.avFile || '');

        logger.log(`${method} ${url} ${chalk.white(code)} ${chalk.blue(path.basename(file))}`);
      }

      // Callback is called at the end of request cycle after headers are set
      onFinished(res, logRequest);

      next();
    });
  }

  config.router.use(requestHandler());
  config.router.use(errorhandler());
  config.router.use(compression());
  config.router.use(cors());

  // pretty print json
  config.app.set('json spaces', 2);

  config.router.use(methodOverride('X-HTTP-Method-Override'));

  config.router.use(
    bodyParser.json({
      limit: _.get(config, 'options.limit', '50mb')
    })
  ); // parse application/json

  config.router.use(
    bodyParser.urlencoded({
      extended: true,
      limit: config.options.limit
    })
  ); // // parse application/x-www-form-urlencoded

  config.router.use(busboy({ immediate: false }));

  config.app.use('/', config.router);
  routes.init();

  config.app.use(notFoundHandler());
};
