const path = require('path');
const config = require('../config');
const Ekko = require('../index');

const test = {
  ekko: null,

  serverSpecHelper() {
    beforeEach(async () => {
      test.ekko = new Ekko(path.join(__dirname, 'test-config.js'));
      await test.ekko.start();
    });

    afterEach(async () => {
      await test.ekko.stop();
    });
  },

  getUrl(endpoint) {
    const url = ['http://localhost:', config.server.address().port, endpoint].join('');
    return url;
  },

  getFile(name) {
    const filePath = path.join(__dirname, 'data', name);
    return filePath;
  }
};

module.exports = test;
