import uiRouter from '@uirouter/angularjs';
import { availity } from 'availity-angular';
import availityApi from '@availity/api-angular';
import app from 'app-module';

import RequestController from './controller';
import requestRules from '../validation';
import body from './body.htm';
import './components';
import { footer, header } from '../common';

const config = ($stateProvider, avValProvider) => {
  $stateProvider.state('app.request', {
    url: '^/request',
    data: {
      title: 'Authorization Request',
    },
    views: {
      header: {
        template: header,
        controller($state) {
          this.title = $state.current.data.title;
        },
        controllerAs: 'vm',
      },
      body: {
        template: body,
        controller: RequestController,
        controllerAs: 'vm',
      },
      footer: {
        template: footer,
      },
    },
  });

  avValProvider.addRules({
    requestRules,
  });
};

app.addModules([uiRouter, availity, availityApi]).config(config);

export default app;
