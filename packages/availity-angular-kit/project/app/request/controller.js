export default class RequestController {

  static _name = 'RequestController';

  constructor(request) {

    const vm = this;

    request.init().then(() => {
      vm.request = request;
    });

  }

}


