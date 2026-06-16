let _id = 0;

class Request {
  constructor() {
    this.responses = [];
    this.id = `request${++_id}`;
  }

  addResponse(response) {
    this.responses.push(response);
  }

  params = null;

  headers = null;
}

export default Request;
