'use strict';

const Ekko = require('availity-ekko');
const settings = require('../settings');

settings.init();

const ekko = new Ekko();
ekko.start({
  data: settings.config().ekko.data,
  routes: settings.config().ekko.routes
});
