import Logger from '@availity/workflow-logger';

import * as version from './version.js';
import lint from './lint.js';
import build from './build.js';

async function release({ settings }) {
  try {
    await version.prompt();
    Logger.info('Started releasing');

    await lint();
    await version.bump();
    await build({ settings });
    await version.tag();
    Logger.success('Finished releasing');
  } catch (error) {
    Logger.failed(`Failed releasing  ${error.message ? `${error.message} \n\n` : ''} ${error.stack || ''}`);
    throw error;
  }
}

export default release;
