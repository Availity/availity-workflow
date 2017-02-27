/* global describe, it, beforeEach, inject, expect */
import angular from 'angular';
import { availity } from 'availity-angular';

import Request from '../request';

describe('model', () => {

  let request;

  beforeEach(() => {
    angular.mock.module('app', 'availity');
  });

  beforeEach(inject((_request_) => {
    request = _request_;
  }));

  describe('request', () => {

    it('should exist', () => {
      expect(request).toBeDefined();
    });

  });

});
