import './request';

class RequestController {
  constructor(request) {
    const vm = this;

    request
      .init()
      .then(() => {
        vm.request = request;
        return request;
      })
      .catch(err => {
        throw err;
      });
  }
}

export default RequestController;
