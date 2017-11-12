/* global describe, it, beforeEach, , expect */
import angular from 'angular';
import app from 'app-module';

describe('model', () => {
  beforeEach(() => {
    angular.mock.module(app.name);
  });

  describe('app module', () => {
    it('should be defined', () => {
      expect(app.addModule).toBeDefined();
      expect(app.addModules).toBeDefined();
    });

    it('should add another module lazily', () => {
      app.addModule('goose');
      expect(app.requires.indexOf('goose')).toBeTruthy();
    });
  });
});
