const get = require('./get');
const post = require('./post');

const response = {
  get: get.send,

  delete: get.send,

  post: post.send,

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
