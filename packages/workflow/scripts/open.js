import opn from 'open';
import chalk from 'chalk';
import urlJoin from 'url-join';
import Logger from '@availity/workflow-logger';
import settings from '../settings/index.js';

export default function open() {
  if (settings.open()) {
    try {
      const port = settings.port();
      const url = settings.open() || '';
      const host = settings.host();

      const uri = urlJoin(`http://${host}:${port}/`, url);
      opn(uri);
      Logger.info(`Opening browser at ${chalk.green(uri)}`);
    } catch {
      // Ignore errors.
    }
  }

  return Promise.resolve(true);
}
