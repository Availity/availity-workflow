import _ from 'lodash';

export default class Request {
  constructor() {
    this.params = null;
    this.headers = null;
    this.responses = [];
    this.id = _.uniqueId('request');
  }

  addResponse(response) {
    this.responses.push(response);
  }
}
