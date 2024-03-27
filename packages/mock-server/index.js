/* eslint-disable promise/avoid-new */
import express from 'express';
import http from 'node:http';
import chalk from 'chalk';
import logger from './logger';
import config from './config';
import middleware from './middleware';

export default class Ekko {
  constructor(ekkoConfig) {
    if (ekkoConfig) {
      const isString = typeof ekkoConfig === 'string';

      if (isString) {
        this.configPath = ekkoConfig;
      } else {
        this.middleware(ekkoConfig);
      }
    }
  }

  async middleware(options) {
    config.path = this.configPath;
    await config.set(options);

    config.app = express();
    config.router = new express.Router();

    middleware.headers();
    middleware.config();

    return config.router;
  }

  async start(options) {
    await this.middleware(options);

    const port = config.options.port || 0;
    const host = config.options.host || 'localhost';
    config.app.set('port', port);
    config.server = http.createServer(config.app);

    return new Promise((resolve, reject) => {
      config.server.listen(config.options.port, host, () => {
        const url = `http://${host}:${config.server.address().port}`;
        logger.getInstance().info(`Ekko server started at ${chalk.green(url)}`);
        resolve(true);
      });

      config.server.on('error', e => {
        if (e.errno === 'EADDRINUSE') {
          logger
            .getInstance()
            .error(`Cannot start Ekko server on PORT ${config.options.port}. Check if port is already in use.`);
        } else {
          logger.getInstance().error(`Failed to start Ekko server on PORT ${config.options.port}`);
        }

        reject(new Error(e));
      });
    });
  }

  async stop() {
    return new Promise(resolve => {
      if (config.server && config.server.close) {
        config.server.close(() => {
          resolve(true);
        });
      } else {
        resolve(true);
      }
    });
  }

  config() {
    return config;
  }
}
