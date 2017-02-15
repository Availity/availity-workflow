import angular from 'angular';
import uiRouter from 'angular-ui-router';

import config from './config';
import { patient, provider, agreement } from './components';
import models from '../models';

export default angular.module('app.request', [
  uiRouter,
  models.name
])
  .directive('patientSection', patient)
  .directive('providerSection', provider)
  .directive('agreementSection', agreement)
  .config(config);

