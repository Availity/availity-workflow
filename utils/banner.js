module.exports = function() {

  var fs = require('fs');
  var path = require('path');
  var utils = require('gulp-util');
  var config = require('../config');

  return utils.template(
    '/**\n' +
    ' * <%= package.name %> v<%= package.version %> -- <%= today %>\n' +
    ' */\n',
    {
      file: '',
      package: JSON.parse(fs.readFileSync(path.join(config.project.path, 'package.json'))),
      today: new Date().toISOString().substr(0, 10)
    }
  );

};
