/* global describe, it, beforeEach, inject, expect */
import angular from 'angular';

import { availity } from 'availity-angular';
import uiRouter from '@uirouter/angularjs';
import app from 'app-module';

import '../request';

describe('request', () => {
  let request;

  beforeEach(() => {
    angular.mock.module(app.name, availity, uiRouter);
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
