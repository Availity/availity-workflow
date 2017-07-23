const Logger = require('availity-workflow-logger');

const version = require('./version');
const lint = require('./lint');
const build = require('./build');


function release() {

  return version.prompt()
    .then(() =>{
      Logger.info('Started releasing');
    })
    .then(lint)
    .then(version.bump)
    .then(build)
    .then(version.tag)
    .then(() => {
      Logger.success('Finished releasing');
    })
    .catch(err => {
      Logger.failed(`Failed releasing:
${err}
`);
    });

}

module.exports = release;

