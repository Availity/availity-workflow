export default class Response {

  static _name = 'response';

  constructor(request, authorizationsResource) {
    this.di = { request, authorizationsResource };
  }

  getAuthorization() {
    return this.di.authorizationsResource
      .query({
        params: {
          npi: this.di.request.npi,
          memberId: this.di.request.memberId,
          dob: this.di.request.dob
        }
      }).then(response => {
        this.auth = response.data;
      });
  }

}
