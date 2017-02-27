// DO NOT DELETE OR MODIFY THIS FILE :)

import angular from 'angular';

const app = angular.module('app', []);

// Lazy loading hotness
const addModules = function(_modules) {

  let modules = _modules;
  if (!Array.isArray(modules)) {
    modules = [modules];
  }

  modules.forEach(module => {
    const contains = app.requires.includes(module);
    if (!contains) {
      app.requires.push(module);
    }
  });

  return app;

};

app.addModule = addModules;
app.addModules = addModules;

export default app;
