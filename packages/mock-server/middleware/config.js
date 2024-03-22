import errorhandler from 'errorhandler';
import compression from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import path from 'node:path';
import bodyParser from 'body-parser';
import busboy from 'connect-busboy';
import _ from 'lodash';
import onFinished from 'on-finished';
import chalk from 'chalk';

import config from '../config';
import routes from '../routes';

import notFoundHandler from './not.found';

import logger from '../logger';

// Custom request logger
export default function development() {
  if (logger.getInstance().canLog()) {
    config.router.use((req, res, next) => {
      function logRequest() {
        const method = `${chalk.white(req.method)}`;
        const url = `${chalk.dim(req.originalUrl || req.url)}`;
        // eslint-disable-next-line no-underscore-dangle
        const code = res._header ? String(res.statusCode) : '';
        const file = chalk.dim(res.avFile || '');

        logger.getInstance().log(`${method} ${url} ${chalk.white(code)} ${chalk.blue(path.basename(file))}`);
      }

      // Callback is called at the end of request cycle after headers are set
      onFinished(res, logRequest);

      next();
    });
  }

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
