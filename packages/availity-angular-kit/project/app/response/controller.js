import './response';

export default class ResponseController {

  constructor(response) {

    const vm = this;

    response.getAuthorization().then(() => {
      vm.response = response.auth;
    });

  }

}


