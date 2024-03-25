import Logger from '@availity/workflow-logger';

import { prompt, bump, tag } from './version.js';
import lint from './lint.js';
import build from './build.js';

export default async function release({ settings }) {
  try {
    await prompt();
    Logger.info('Started releasing');

    await lint();
    await bump();
    await build({ settings });
    await tag();
    Logger.success('Finished releasing');
  } catch (error) {
    Logger.failed(
      `Failed releasing  ${error.message ? `${error.message} \n\n` : ''} ${error.stack ? error.stack : ''}`
    );
    throw error;
  }
}
