const settings = require('@availity/workflow-settings');
const Logger = require('@availity/workflow-logger');
const figures = require('figures');

function plugin(path) {
  let plugin = settings.pkg().availityWorkflow && settings.pkg().availityWorkflow.plugin;
  plugin =
    plugin ||
    (settings.pkg().devDependencies &&
      Object.keys(settings.pkg().devDependencies).filter(p => /@availity\/workflow-plugin-.+/.test(p)));

  if (!plugin) {
    Logger.failed(`Project must be configured to use React or Angular

1. Install appropriate plugin:

${figures.pointer} npm install @availity/workflow-<react|angular>

2. Update package.json with plugin reference:

${figures.pointer}

"availityWorkflow": {
  "plugin": "@availity/workflow-<react|angular>"
}

`);

    throw new Error('Missing @availity/workflow plugin');
  }

  let file;
  let error;

  try {
    const filePath = `${plugin}/${path}`;
    // eslint-disable-next-line
    file = require(filePath);
  } catch (err) {
    error = err;
  }

  if (!file) {
    // Workaround when Lerna linked modules
    // eslint-disable-next-line global-require
    const relative = require('require-relative');
    try {
      file = relative(`${plugin}/${path}`, settings.project());
    } catch (err) {
      throw err;
    }
  }

  if (!file && error) {
    throw error;
  }

  return file;
}

module.exports = plugin;
