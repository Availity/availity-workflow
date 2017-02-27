import uiRouter from 'angular-ui-router';
import { availity } from 'availity-angular';
import app from 'app-module';

import RequestController from './controller';
import { request } from '../validation';
import body from './body.htm';
import './components';
import { footer, header } from '../common';

const config = function($stateProvider, avValProvider) {

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

};

app
  .addModules([uiRouter, availity])
  .config(config);

export default app;
