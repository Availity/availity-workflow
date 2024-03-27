import path from 'node:path';
import * as url from 'node:url';
import config from '../config';
import Ekko from '../index';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

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
    const url = [':', config.server.address().port, endpoint].join('');
    return url;
  },

  getFile(name) {
    const filePath = path.join(__dirname, 'data', name);
    return filePath;
  }
};

export default test;
