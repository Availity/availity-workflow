const request = require('superagent');
const intersection = require('lodash/intersection');
const isEqual = require('lodash/isEqual');

const helper = require('../../tests/helpers');

const getConfiguredVerbs = (ekko, path) => {
  const routeConfigs = ekko.config().router.stack;

  const verbs = routeConfigs
    .filter((routeConfig) => routeConfig.route !== undefined)
    .map((routeConfig) => {
      if (routeConfig.route.path === path) {
        return Object.keys(routeConfig.route.methods)[0];
      }
      return null;
    })
    .filter(Boolean);

  return verbs;
};

describe('Routes', () => {
  helper.serverSpecHelper();

  it('route 1 should be defined with GET, PUT, POST and DELETE', () => {
    // since no verbs were defined the the mock server
    // will configure all verbs for this route
    const verbs = ['get', 'put', 'post', 'delete'];

    const configuredVerbs = getConfiguredVerbs(helper.ekko, '/v1/route1.:format?');

    const count = intersection(verbs, configuredVerbs).length;
    expect(count).toBe(4);
  });

  it('route 1 should respond with dummy-response1.json', async () => {
    const res = await request.get(helper.getUrl('/v1/route1'));

    expect(res.status).toBe(200);
    expect(isEqual(res.body, { a: 1 })).toBeTruthy();
  });

  it('route 2 should respond with dummy-response2.json for GET', async () => {
    const res = await request.get(helper.getUrl('/internal/v2/route2'));
    expect(res.status).toBe(200);
    expect(isEqual(res.body, { b: 2 })).toBeTruthy();
  });

  it('route 2 should respond with dummy-response3.json for POST', async () => {
    const res = await request.post(helper.getUrl('/internal/v2/route2')).send({ bar: 'baz' });
    expect(res.status).toBe(200);
    expect(isEqual(res.body, { c: 3 })).toBeTruthy();
  });

  it('route 4 should respond with dummy-response-2.json for POST with parameters', async () => {
    const res = await request.post(helper.getUrl('/v1/route4')).send({ a: { b: 'b' } });
    expect(res.status).toBe(200);
    expect(isEqual(res.body, { b: 2 })).toBeTruthy();
  });

  it('route 4 should response with dummy-response1.json [default file] for POST with no parameters', async () => {
    const res = await request.post(helper.getUrl('/v1/route4'));
    expect(res.status).toBe(200);
    expect(isEqual(res.body, { a: 1 })).toBeTruthy();
  });

  it('route 9 should response with dummy-response1.json and status 201 for GET', async () => {
    const res = await request.get(helper.getUrl('/v1/route9'));
    expect(res.status).toBe(201);
    expect(isEqual(res.body, { a: 1 })).toBeTruthy();
  });

  it('route 9 should response with dummy-response2.json and status 422 for POST', async () => {
    const res = await request.post(helper.getUrl('/v1/route9'));
    expect(res.status).toBe(203);
    expect(isEqual(res.body, { b: 2 })).toBeTruthy();
  });
});
