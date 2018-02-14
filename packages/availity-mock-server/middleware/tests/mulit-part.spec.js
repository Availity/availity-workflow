'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* globals describe, it */

const request = require('superagent');
const _ = require('lodash');
const helper = require('../../tests/helpers');

describe('Multi-part', () => {
  helper.serverSpecHelper();

  it('should respond with dummy-response-1.json for empty form fields and one file attachment', _asyncToGenerator(function* () {
    const res = yield request.post(helper.getUrl('/v1/route5')).type('multipart/form-data').attach('attatchment', helper.getFile('dummy-response-1.json'));

    expect(res.status).toBe(200);
    expect(_.isEqual(res.body, { a: 1 })).toBeTruthy();
  }));

  it('should respond with dummy-response-2.json for empty form fields and one file attachment', _asyncToGenerator(function* () {
    const res = yield request.post(helper.getUrl('/v1/route5')).type('multipart/form-data').attach('attachment', helper.getFile('dummy-response-2.json'));

    expect(res.status).toBe(200);
    expect(_.isEqual(res.body, { b: 2 })).toBeTruthy();
  }));

  it('should respond with dummy-response-2.json for 1 matching form field and one file attachment', _asyncToGenerator(function* () {
    const res = yield request.post(helper.getUrl('/v1/route5')).type('multipart/form-data').attach('attachment', helper.getFile('dummy-response-2.json')).field('a', '1');

    expect(res.status).toBe(200);
    expect(_.isEqual(res.body, { b: 2 })).toBeTruthy();
  }));

  it('should respond with dummy-response-3.json for 2 matching form fields and one file attachment', _asyncToGenerator(function* () {
    const res = yield request.post(helper.getUrl('/v1/route5')).type('multipart/form-data').attach('attachment', helper.getFile('dummy-response-3.json')).field('a', '1').field('b', '2');

    expect(res.status).toBe(200);
    expect(_.isEqual(res.body, { c: 3 })).toBeTruthy();
  }));

  it('should respond with dummy-response-4.json for field name that matches file input name', _asyncToGenerator(function* () {
    const res = yield request.post(helper.getUrl('/v1/route5')).type('multipart/form-data').attach('attachment', helper.getFile('dummy-response-4.json')).field('a', '1').field('b', '2');

    expect(res.status).toBe(200);
    expect(_.isEqual(res.body, { d: 4 })).toBeTruthy();
  }));
});
