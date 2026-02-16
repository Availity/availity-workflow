import path from 'path';
import config from '../config/index.js';
import Ekko from '../index.js';

const test = {
  ekko: null,

  serverSpecHelper() {
    beforeEach(async () => {
      test.ekko = new Ekko(path.join(import.meta.dirname, 'test-config.js'));
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
    const filePath = path.join(import.meta.dirname, 'data', name);
    return filePath;
  }
};

export default test;
