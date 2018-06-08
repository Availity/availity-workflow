import app from 'app-module';

import './authorizations-resource';

class Response {
  constructor(request, authorizationsResource) {
    this.di = { request, authorizationsResource };
  }

  getAuthorization() {
    return this.di.authorizationsResource
      .query({
        params: {
          npi: this.di.request.npi,
          memberId: this.di.request.memberId,
          dob: this.di.request.dob,
        },
      })
      .then(response => {
        this.auth = response.data;
        return response.data;
      });
  }
}

app.service('response', Response);
