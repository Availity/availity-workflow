import _ from 'lodash';

export default class Response {
  constructor(response) {
    this.headers = null;
    this.file = null;
    this.url = null;
    this.latency = null;
    this.status = null;
    this.repeat = 1;

    if (response) {
      this.set(response);
    }

    this.id = _.uniqueId('response');
  }

  set(response) {
    this.headers = response.headers || this.headers;
    this.file = response.file || this.file;
    this.url = response.url || this.url;
    this.responseHeaders = response.responseHeaders || this.responseHeaders;
    this.latency = response.latency || this.latency;
    this.status = response.status || this.status;
    this.repeat = response.repeat || this.repeat;
  }
}
