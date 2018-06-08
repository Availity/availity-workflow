// DO NOT DELETE OR MODIFY THIS FILE :)

import angular from 'angular';

const app = angular.module('app', []);

// Lazy loading hotness
const addModules = function addModules(_modules) {
  let modules = _modules;
  if (!Array.isArray(modules)) {
    modules = [modules];
  }

  angular.forEach(modules, m => {
    const index = app.requires.indexOf(m);
    if (index === -1) {
      app.requires.push(m);
    }
  });

  return app;
};

app.addModule = addModules;
app.addModules = addModules;

export default app;
