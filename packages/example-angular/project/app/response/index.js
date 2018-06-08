import app from 'app-module';
import uiRouter from '@uirouter/angularjs';

import ResponseController from './controller';
import body from './body.htm';
import { footer, header } from '../common';

app.addModule(uiRouter).config($stateProvider => {
  // Query params must be present for ui-router to modify the
  // url in the browser.
  $stateProvider.state('app.response', {
    url: '^/response?accepted',
    data: {
      title: 'Authorization Response',
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
        controller: ResponseController,
        controllerAs: 'vm',
      },
      footer: {
        template: footer,
      },
    },
  });
});

export default app;
