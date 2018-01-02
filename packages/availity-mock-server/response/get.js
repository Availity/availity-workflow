const match = require('./match');
const result = require('./result');

const get = {
  send(req, res) {
    match.set(req, res);
    result.send(req, res);
  }
};

module.exports = get;
