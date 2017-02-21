const settings = require('availity-workflow-settings');
const Logger = require('availity-workflow-logger');
const figures = require('figures');

function plugin(path) {

  if (!settings.pkg().availityWorkflow || !settings.pkg().availityWorkflow.plugin) {

    Logger.failed(`Project must be configured to use React or Angular

1. Install appropriate plugin:

${figures.pointer} npm install availity-workflow-<react|angular>

2. Update package.json with plugin reference:

${figures.pointer} "availityWorkflow": { "plugin": "availity-workflow-<react|angular>" }

`);

    throw new Error('Missing availity-workflow plugin');

  }


  let file;

  try {
    file = require(`${settings.pkg().availityWorkflow.plugin}/${path}`);
  } catch (err) {
    // Workaround when Lerna linked modules
    const relative = require('require-relative');
    file = relative(`${settings.pkg().availityWorkflow.plugin}/${path}`, settings.project());
  }

  return file;

}

module.exports = plugin;
