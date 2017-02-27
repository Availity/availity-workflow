import './request';

class RequestController {

  constructor(request) {

    const vm = this;

    request.init().then(() => {
      vm.request = request;
    });

  }

}

export default RequestController;


