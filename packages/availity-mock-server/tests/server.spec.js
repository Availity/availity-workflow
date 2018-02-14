'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const path = require('path');
const Ekko = require('../index');

describe('Ekko', () => {
  it('should be defined', () => {
    expect(Ekko).toBeDefined();
  });

  describe('Events', () => {
    it('should emit started event when started', done => {
      const ekko = new Ekko(path.join(__dirname, 'test-config.js'));
      ekko.on('av:started', _asyncToGenerator(function* () {
        yield ekko.stop();
        done();
      }));
      ekko.start();
    });

    it('should emit stopped event when stopped', (() => {
      var _ref2 = _asyncToGenerator(function* (done) {
        const ekko = new Ekko(path.join(__dirname, 'test-config.js'));
        ekko.on('av:stopped', function () {
          done();
        });
        yield ekko.start();
        ekko.stop();
      });

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    })());
  });
});
