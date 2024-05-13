const get = require('./get');
const post = require('./post');
const patch = require('./patch');

const response = {
  get: get.send,

  head: get.send,

  delete: get.send,

  post: post.send,

  patch: patch.send,

  put: post.send,

  send(req, res, next) {
    const method = req.method.toLowerCase();

    if (this[method]) {
      this[method](req, res, next);
      return;
    }

    next();
  }
};

module.exports = response;
