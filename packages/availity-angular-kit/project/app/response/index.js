import angular from 'angular';
import uiRouter from 'angular-ui-router';

import config from './config';
import models from '../models';
import AuthorizationsResourceFactory from './authorizations-resource.js';

export default angular.module('app.response', [
  uiRouter,
  models.name
])
  .factory(AuthorizationsResourceFactory._name, AuthorizationsResourceFactory.factory)
  .config(config);

