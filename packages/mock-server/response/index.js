import get from './get.js';
import post from './post.js';
import patch from './patch.js';

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

export default response;
