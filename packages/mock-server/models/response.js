let _id = 0;

class Response {
  constructor(response) {
    if (response) {
      this.set(response);
    }

    this.id = `response${++_id}`;
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

  headers = null;

  file = null;

  url = null;

  latency = null;

  status = null;

  repeat = 1;
}

export default Response;
