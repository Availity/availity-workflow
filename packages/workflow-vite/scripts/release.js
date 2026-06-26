import Logger from '@availity/workflow-logger';
import version_module from './version.js';
import lint from './lint.js';
import build from './build.js';

export default async function release({ settings, version }) {
  try {
    await version_module.prompt(settings, version);
    Logger.info('Started releasing');
    await lint({ settings });
    await version_module.bump(settings);
    await build({ settings });
    await version_module.tag(settings);
    Logger.success('Finished releasing');
  } catch (error) {
    Logger.failed(`Failed releasing  ${error.message ? `${error.message} \n\n` : ''} ${error.stack || ''}`);
    throw error;
  }
}
