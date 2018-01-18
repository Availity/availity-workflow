import { availity, availityUi, availityConfig } from 'availity-angular';
import uiRouter from '@uirouter/angularjs';
import shims from 'angular-shims-placeholder';
import app from 'app-module';

import './app-component';
import './request';
import './response';

app
  .addModules([availity, availityUi, availityConfig, uiRouter, shims])
  .config(($urlRouterProvider, $stateProvider) => {
    $stateProvider.state('app', {
      template: '<app></app>',
    });

    $urlRouterProvider.otherwise('/request');
  });

export default app;
