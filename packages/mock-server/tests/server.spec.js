import request from 'superagent';
import path from 'path';
import Ekko from '../index.js';
import config from '../config/index.js';

describe('Ekko', () => {
  it('should be defined', () => {
    expect(Ekko).toBeDefined();
  });

  describe('lifecycle', () => {
    let ekko;

    afterEach(async () => {
      if (ekko) {
        await ekko.stop();
        ekko = null;
      }
    });

    it('starts and listens on a port', async () => {
      ekko = new Ekko(path.join(import.meta.dirname, 'test-config.js'));
      await ekko.start();

      const { port } = config.server.address();
      expect(port).toBeGreaterThan(0);
    });

    it('responds to configured routes after start', async () => {
      ekko = new Ekko(path.join(import.meta.dirname, 'test-config.js'));
      await ekko.start();

      const { port } = config.server.address();
      const res = await request.get(`http://127.0.0.1:${port}/v1/route1`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ a: 1 });
    });

    it('stops cleanly and refuses connections', async () => {
      ekko = new Ekko(path.join(import.meta.dirname, 'test-config.js'));
      await ekko.start();

      const { port } = config.server.address();
      await ekko.stop();
      ekko = null;

      await expect(request.get(`http://127.0.0.1:${port}/v1/route1`)).rejects.toThrow();
    });

    it('stop resolves even when server was never started', async () => {
      ekko = new Ekko();
      await expect(ekko.stop()).resolves.toBe(true);
      ekko = null;
    });

    it('can start with options object instead of config path', async () => {
      ekko = new Ekko();
      await ekko.start({
        latency: 0,
        port: 0,
        host: '127.0.0.1',
        data: path.join(import.meta.dirname, 'data'),
        routes: path.join(import.meta.dirname, 'dummy.routes.config.json')
      });

      const { port } = config.server.address();
      expect(port).toBeGreaterThan(0);

      const res = await request.get(`http://127.0.0.1:${port}/v1/route1`);
      expect(res.status).toBe(200);
    });

    it('exposes config via config() method', async () => {
      ekko = new Ekko(path.join(import.meta.dirname, 'test-config.js'));
      await ekko.start();

      const ekkoConfig = ekko.config();
      expect(ekkoConfig).toBeDefined();
      expect(ekkoConfig.server).toBeDefined();
      expect(ekkoConfig.options).toBeDefined();
    });
  });
});
