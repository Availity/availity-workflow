export default class ResponseController {

  static _name = 'ResponseController';

  constructor(response) {

    const vm = this;

    response.getAuthorization().then(() => {
      vm.response = response.auth;
    });

  }

}


