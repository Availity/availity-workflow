const Logger = require('@availity/workflow-logger');

const version = require('./version');
const lint = require('./lint');
const build = require('./build');

function release() {
  return version
    .prompt()
    .then(() => {
      Logger.info('Started releasing');
      return true;
    })
    .then(lint)
    .then(version.bump)
    .then(build)
    .then(version.tag)
    .then(() => {
      Logger.success('Finished releasing');
      return true;
    })
    .catch(err => {
      Logger.failed(`Failed releasing:
${err}
`);
    });
}

module.exports = release;
