import Logger from '@availity/workflow-logger';

import version from './version';
import lint from './lint';
import build from './build';

export default async function release({ settings }) {
  try {
    await version.prompt();
    Logger.info('Started releasing');

    await lint();
    await version.bump();
    await build({ settings });
    await version.tag();
    Logger.success('Finished releasing');
  } catch (error) {
    Logger.failed(
      `Failed releasing  ${error.message ? `${error.message} \n\n` : ''} ${error.stack ? error.stack : ''}`
    );
    throw error;
  }
}
