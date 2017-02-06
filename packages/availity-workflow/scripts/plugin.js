const settings = require('availity-workflow-settings');

function plugin(path) {

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
