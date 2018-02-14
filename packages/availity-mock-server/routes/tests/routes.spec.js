'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const request = require('superagent');
const _ = require('lodash');
const helper = require('../../tests/helpers');

describe('Routes', () => {
  helper.serverSpecHelper();

  it('route 1 should be defined with GET, PUT, POST and DELETE', () => {
    // since no verbs were defined the the mock server
    // will configure all verbs for this route
    const verbs = ['get', 'put', 'post', 'delete'];

    const getConfiguredVerbs = (ekko, expectedVerbs, path) => {
      const routeConfigs = ekko.config().router.stack;

      const verbs = _.chain(routeConfigs).filter(routeConfig => routeConfig.route !== undefined).map(routeConfig => {
        if (routeConfig.route.path === path) {
        return _.keys(routeConfig.route.methods)[0];
        }
        return null;
      }).filter(method => method !== undefined).value();

      return verbs;
    };

    const configuredVerbs = getConfiguredVerbs(helper.ekko, verbs, '/v1/route1.:format?');

    const count = _.intersection(verbs, configuredVerbs).length;
    expect(count).toBe(4);
  });

  it('route 1 should respond with dummy-response1.json', _asyncToGenerator(function* () {
    const res = yield request.get(helper.getUrl('/v1/route1'));

    expect(res.status).toBe(200);
    expect(_.isEqual(res.body, { a: 1 })).toBeTruthy();
  }));

  it('route 2 should respond with dummy-response2.json for GET', _asyncToGenerator(function* () {
    const res = yield request.get(helper.getUrl('/internal/v2/route2'));
    expect(res.status).toBe(200);
    expect(_.isEqual(res.body, { b: 2 })).toBeTruthy();
  }));

  it('route 2 should respond with dummy-response3.json for POST', _asyncToGenerator(function* () {
    const res = yield request.post(helper.getUrl('/internal/v2/route2')).send({ bar: 'baz' });
    expect(res.status).toBe(200);
    expect(_.isEqual(res.body, { c: 3 })).toBeTruthy();
  }));

  it('route 4 should respond with dummy-response-2.json for POST with parameters', _asyncToGenerator(function* () {
    const res = yield request.post(helper.getUrl('/v1/route4')).send({ a: { b: 'b' } });
    expect(res.status).toBe(200);
    expect(_.isEqual(res.body, { b: 2 })).toBeTruthy();
  }));

  it('route 4 should response with dummy-response1.json [default file] for POST with no parameters', _asyncToGenerator(function* () {
    const res = yield request.post(helper.getUrl('/v1/route4'));
    expect(res.status).toBe(200);
    expect(_.isEqual(res.body, { a: 1 })).toBeTruthy();
  }));

  it('route 9 should response with dummy-response1.json and status 201 for GET', _asyncToGenerator(function* () {
    const res = yield request.get(helper.getUrl('/v1/route9'));
    expect(res.status).toBe(201);
    expect(_.isEqual(res.body, { a: 1 })).toBeTruthy();
  }));

  it('route 9 should response with dummy-response2.json and status 422 for POST', _asyncToGenerator(function* () {
    const res = yield request.post(helper.getUrl('/v1/route9'));
    expect(res.status).toBe(203);
    expect(_.isEqual(res.body, { b: 2 })).toBeTruthy();
  }));
});
