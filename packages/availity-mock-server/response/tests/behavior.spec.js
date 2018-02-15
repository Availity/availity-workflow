'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const request = require('superagent');
const helper = require('../../tests/helpers');

describe('Behavior', () => {
  helper.serverSpecHelper();

  it('should respond with 404 for undefined route', _asyncToGenerator(function* () {
    try {
      yield request.get(helper.getUrl('/dummy/route'));
    } catch (err) {
      expect(err.status).toBe(404);
    }
  }));

  it('should respond with 404 when file does not exist', _asyncToGenerator(function* () {
    try {
      yield request.get(helper.getUrl('/bad/file'));
    } catch (err) {
      expect(err.status).toBe(404);
    }
  }));

  describe('Events', () => {
    it('should emit file not found event when file does not exist', done => {
      helper.ekko.on('av:fileNotFound', () => {
      done();
    });

    request.get(helper.getUrl('/bad/file')).end();
    });

    it('should emit response event when file exists', done => {
      helper.ekko.on('av:response', () => {
      done();
    });

    request.get(helper.getUrl('/v1/route1')).end();
    });
  });
});
