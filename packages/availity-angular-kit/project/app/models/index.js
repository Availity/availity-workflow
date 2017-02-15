import angular from 'angular';

import Request from './request';
import Response from './response';

export default angular.module('app.models', ['availity'])
  .service(Request._name, Request)
  .service(Response._name, Response);
