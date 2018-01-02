const request = require('superagent');
const helper = require('../../tests/helpers');

describe('Behavior', () => {
  helper.serverSpecHelper();

  it('should respond with 404 for undefined route', async () => {
    try {
      await request.get(helper.getUrl('/dummy/route'));
    } catch (err) {
      expect(err.status).toBe(404);
    }
  });

  it('should respond with 404 when file does not exist', async () => {
    try {
      await request.get(helper.getUrl('/bad/file'));
    } catch (err) {
      expect(err.status).toBe(404);
    }
  });

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
