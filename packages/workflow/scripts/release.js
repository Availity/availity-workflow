const Logger = require('@availity/workflow-logger');

const version = require('./version');
const lint = require('./lint');
const build = require('./build');

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
    Logger.failed(
      `Failed releasing  ${error.message ? `${error.message} \n\n` : ''} ${error.stack ? error.stack : ''}`
    );
    throw error;
  }
}

module.exports = release;
