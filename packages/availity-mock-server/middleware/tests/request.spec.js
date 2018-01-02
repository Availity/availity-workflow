const request = require('superagent');
const helper = require('../../tests/helpers');

describe('Events', () => {
  helper.serverSpecHelper();

  it('should emit an event for all requests when a request is received', done => {
    helper.ekko.on('av:request', () => {
      done();
    });

    request.post(helper.getUrl('/v1/route9')).end();
  });
});
