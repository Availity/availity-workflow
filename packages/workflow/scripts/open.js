import opn from 'open';
import chalk from 'chalk';
import Logger from '@availity/workflow-logger';
import settings from '../settings/index.js';

function open() {
  if (settings.open()) {
    try {
      const port = settings.port();
      const url = settings.open() || '';
      const host = settings.host();

      const uri = new URL(url, `http://${host}:${port}/`).href;
      opn(uri);
      Logger.info(`Opening browser at ${chalk.green(uri)}`);
    } catch {
      // Ignore errors.
    }
  }

  return Promise.resolve(true);
}

export default open;
