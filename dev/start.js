var copy  = require('./copy');
var server = require('./server');

function start() {
  return copy()
    .then(server.start);
}

module.exports = start;
