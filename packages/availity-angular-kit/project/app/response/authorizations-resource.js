import app from 'app-module';
import { availity } from 'availity-angular';

const authorizationResourceFactory = function(AvProxyResource) {

  class AuthorizationResource extends AvProxyResource {

    constructor() {
      super({
        tenant: 'healthplan',
        name: 'v1/authorizations'
      });
    }
  }

  return new AuthorizationResource();

};

app
  .addModule(availity)
  .factory('authorizationsResource', authorizationResourceFactory);

export default app;
