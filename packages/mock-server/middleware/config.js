import errorhandler from 'errorhandler';
import compression from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import path from 'path';
import express from 'express';
import busboy from 'connect-busboy';
import chalk from 'chalk';

import config from '../config/index.js';
import routes from '../routes/index.js';
import logger from '../logger/index.js';

import notFoundHandler from './not.found.js';

const log = logger.getInstance();

// Custom request logger
export default function development() {
  if (log.canLog()) {
    config.router.use((req, res, next) => {
      function logRequest() {
        const method = `${chalk.white(req.method)}`;
        const url = `${chalk.dim(req.originalUrl || req.url)}`;
        const code = res._header ? String(res.statusCode) : '';
        const file = chalk.dim(res.avFile || '');

        log.log(`${method} ${url} ${chalk.white(code)} ${chalk.blue(path.basename(file))}`);
      }

      // Callback is called at the end of request cycle after headers are set
      res.on('finish', logRequest);

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
    express.json({
      limit: config?.options?.limit ?? '50mb'
    })
  ); // parse application/json

  config.router.use(
    express.urlencoded({
      extended: true,
      limit: config.options.limit
    })
  ); // parse application/x-www-form-urlencoded

  config.router.use(busboy({ immediate: false }));

  config.app.use('/', config.router);
  routes.init();

  config.app.use(notFoundHandler());
}
