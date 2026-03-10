let _id = 0;

class Request {
  constructor() {
    this.params = null;
    this.headers = null;
    this.responses = [];
    this.id = `request${++_id}`;
  }

  addResponse(response) {
    this.responses.push(response);
  }
}

export default Request;
