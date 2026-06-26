import opn from 'open';
import chalk from 'chalk';
import Logger from '@availity/workflow-logger';

function open(settings) {
  const openPath = settings.open();
  if (!openPath) return;

  try {
    const uri = new URL(openPath, `http://${settings.host()}:${settings.port()}/`).href;
    opn(uri);
    Logger.info(`Opening browser at ${chalk.green(uri)}`);
  } catch (error) {
    Logger.warn(`Failed to open browser: ${error.message}`);
  }
}

export default open;
