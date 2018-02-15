'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const request = require('superagent');
const _ = require('lodash');
const helper = require('../../tests/helpers');

describe('Asynchronous', () => {
  helper.serverSpecHelper();

  it('should respond with 202 then 201', _asyncToGenerator(function* () {
    let res = yield request.get(helper.getUrl('/v1/route6'));
    expect(res.status).toBe(202);
    expect(_.isEqual(res.body, { c: 3 })).toBeTruthy();

    res = yield request.get(helper.getUrl('/v1/route6'));
    expect(res.status).toBe(201);
    expect(_.isEqual(res.body, { d: 4 })).toBeTruthy();
  }));

  it('should repeat dummy-response1.json x3, dummy-response2.json x1 then followed by a dummy-response2 x1', _asyncToGenerator(function* () {
    let res = yield request.get(helper.getUrl('/v1/route8'));
    expect(res.status).toBe(202);
    expect(_.isEqual(res.body, { a: 1 })).toBeTruthy();

    res = yield request.get(helper.getUrl('/v1/route8'));
    expect(res.status).toBe(202);
    expect(_.isEqual(res.body, { a: 1 })).toBeTruthy();

    res = yield request.get(helper.getUrl('/v1/route8'));
    expect(res.status).toBe(202);
    expect(_.isEqual(res.body, { a: 1 })).toBeTruthy();

    res = yield request.get(helper.getUrl('/v1/route8'));
    expect(res.status).toBe(202);
    expect(_.isEqual(res.body, { b: 2 })).toBeTruthy();

    res = yield request.get(helper.getUrl('/v1/route8'));
    expect(res.status).toBe(201);
    expect(_.isEqual(res.body, { c: 3 })).toBeTruthy();
  }));
});
