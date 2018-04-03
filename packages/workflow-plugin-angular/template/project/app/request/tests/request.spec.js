/* global describe, it, beforeEach, inject, expect */
import angular from 'angular';

import availityApi from '@availity/api-angular';
import uiRouter from '@uirouter/angularjs';
import app from 'app-module';

import '../request';

describe('request', () => {
  let request;

  beforeEach(() => {
    angular.mock.module(app.name, availityApi, uiRouter);
  });

  beforeEach(
    inject(_request_ => {
      request = _request_;
    })
  );

  it('should exist', () => {
    expect(request).toBeDefined();
  });
});
