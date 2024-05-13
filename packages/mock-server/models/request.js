const uniqueId = require('lodash/uniqueId');

class Request {
  constructor() {
    this.params = null;
    this.headers = null;
    this.responses = [];
    this.id = uniqueId('request');
  }

  addResponse(response) {
    this.responses.push(response);
  }
}

module.exports = Request;
