export default class AuthorizationResourceFactory {

  static _name = 'authorizationsResource';

  static factory(AvProxyResource){

    class AuthorizationResource extends AvProxyResource {

      constructor() {
        super({
          tenant: 'healthplan',
          name: 'v1/authorizations'
        });
      }
    }

    return new AuthorizationResource();

  }

}


