'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const request = require('superagent');
const _ = require('lodash');
const helper = require('../../tests/helpers');

describe('Headers', () => {
  helper.serverSpecHelper();

  it('should respond with custom headers', _asyncToGenerator(function* () {
    const res = yield request.get(helper.getUrl('/v1/route7'));
    expect(res.status).toBe(200);
    expect(_.isEqual(res.body, { b: 2 })).toBeTruthy();
    expect(res.header.ping).toBe('pong');
  }));

  it('route 2 should respond with dummy-response2.json for POST with X-HTTP-Method-Override:GET', _asyncToGenerator(function* () {
    const res = yield request.post(helper.getUrl('/internal/v2/route2')).set('X-HTTP-Method-Override', 'GET').send({ bar: 'baz' });

    expect(res.status).toBe(200);
    expect(_.isEqual(res.body, { b: 2 })).toBeTruthy();
  }));
});
