import angular from 'angular';
import { availity, availityUi, availityConfig } from 'availity-angular';
import uiRouter from 'angular-ui-router';
import shims from 'angular-shims-placeholder';

import config from './app-config';
import app from 'app-component';

import request from './request';
import response from './response';
import models from './models';

angular.module('app', [
  availity,
  availityUi,
  availityConfig,
  uiRouter,
  shims,
  request.name,
  response.name,
  models.name
])
  .component('app', app)
  .config(config);
