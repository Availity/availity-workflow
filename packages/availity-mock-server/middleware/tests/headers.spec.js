const request = require('superagent');
const _ = require('lodash');
const helper = require('../../tests/helpers');

describe('Headers', () => {
  helper.serverSpecHelper();

  it('should respond with custom headers', async () => {
    const res = await request.get(helper.getUrl('/v1/route7'));
    expect(res.status).toBe(200);
    expect(_.isEqual(res.body, { b: 2 })).toBeTruthy();
    expect(res.header.ping).toBe('pong');
  });

  it('route 2 should respond with dummy-response2.json for POST with X-HTTP-Method-Override:GET', async () => {
    const res = await request
      .post(helper.getUrl('/internal/v2/route2'))
      .set('X-HTTP-Method-Override', 'GET')
      .send({ bar: 'baz' });

    expect(res.status).toBe(200);
    expect(_.isEqual(res.body, { b: 2 })).toBeTruthy();
  });
});
