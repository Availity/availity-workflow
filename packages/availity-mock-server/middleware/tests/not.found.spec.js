const request = require('superagent');
const helper = require('../../tests/helpers');

describe('Events', () => {
  helper.serverSpecHelper();

  it('should emit an event when a route is undefined', done => {
    helper.ekko.on('av:fileNotFound', () => {
      done();
    });

    request.get(helper.getUrl('/dummy/file')).end();
  });
});
