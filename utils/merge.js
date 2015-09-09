var _ = require('lodash');

module.exports = function(target, source) {

  return _.merge(target, source, function(x, y) {
    if (_.isArray(x)) {
      return x.concat(y);
    }
  });

};
