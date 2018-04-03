const path = require('path');
const Ekko = require('../index');

describe('Ekko', () => {
  it('should be defined', () => {
    expect(Ekko).toBeDefined();
  });

  describe('Events', () => {
    it('should emit started event when started', done => {
      const ekko = new Ekko(path.join(__dirname, 'test-config.js'));
      ekko.on('av:started', async () => {
        await ekko.stop();
        done();
      });
      ekko.start();
    });

    it('should emit stopped event when stopped', async done => {
      const ekko = new Ekko(path.join(__dirname, 'test-config.js'));
      ekko.on('av:stopped', () => {
        done();
      });
      await ekko.start();
      ekko.stop();
    });
  });
});
