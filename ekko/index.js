var Ekko = require('availity-ekko');

var context = require('../context');
var ekko = new Ekko();

ekko.start(context.settings);
