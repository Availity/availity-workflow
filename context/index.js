const _ = require('lodash');
const utils = require('../utils');

class Context {

  constructor() {

    this.settings = require('../settings');
    this.meta = {};

    const environment = utils.env.load(this);
    _.merge(this.settings, environment);
  }

  set(context) {

    const self = this;

    _.forEach(['gulp', 'webpack', 'karma'], function(value) {
      self[value] = context[value];
    });

  }

  getConfig() {
    const environment = process.env.NODE_ENV || 'development';
    return this.settings[environment];
  }
}


module.exports = new Context();
