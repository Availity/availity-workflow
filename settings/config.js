'use strict';

const path = require('path');

module.exports = {

  development: {
    open: '#',
    notifications: false,
    host: '127.0.0.1',
    port: 3000
  },

  ekko: {
    host: '127.0.0.1',
    port: 9999,
    data: path.join(process.cwd(), '../data'),
    routes: path.join(process.cwd(), './routes.json')
  }

};
