var fs = require('fs');
module.exports = function(file, raw) {

  var _file = null;
  try {
    if (raw) {
      _file =  fs.readFileSync(file, 'utf8');
    }else {
      _file = require(file);
    }
  }catch(err) {
    // no op
  }

  return _file;

};
