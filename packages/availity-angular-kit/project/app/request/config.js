import RequestController from './controller';
import { request } from '../validation';
import body from './body.htm';
import { footer, header } from '../common';

export default function($stateProvider, avValProvider) {

  $stateProvider
    .state('app.request', {
      url: '^/request',
      data: {
        title: 'Authorization Request'
      },
      views: {
        'header': {
          template: header,
          controller($state) {
            this.title = $state.current.data.title;
          },
          controllerAs: 'vm'
        },
        'body': {
          template: body,
          controller: RequestController,
          controllerAs: 'vm'
        },
        'footer': {
          template: footer
        }
      }
    });

  avValProvider.addRules({
    request
  });

}
