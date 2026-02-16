import request from 'superagent';

import helper from '../../tests/helpers.js';

describe('Scoring', () => {
  helper.serverSpecHelper();

  describe('Parameters', () => {
    it('route 3 should respond with dummy-response2.json for GET with partial parameters', async () => {
      const res = await request.get(helper.getUrl('/v1/route3?param1=1'));
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ b: 2 });
    });

    it('route 3 should respond with dummy-response2.json for GET with specified parameters', async () => {
      const res = await request.get(helper.getUrl('/v1/route3?param1=1&param2=2'));
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ b: 2 });
    });

    it("route 3 should respond with dummy-response3.json for GET with '.' in parameters", async () => {
      const res = await request.get(helper.getUrl('/v1/route3?param1=1&param2=2&param3=3'));
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ c: 3 });
    });

    it('route 3 should respond with dummy-response3.json for GET with specified parameters', async () => {
      const res = await request.get(helper.getUrl('/v1/route3?param1.2=abc'));
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ c: 3 });
    });

    it('route 3 should respond with dummy-response4.json for GET with no matching parameters', async () => {
      const res = await request.get(helper.getUrl('/v1/route3?param1=452'));
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ d: 4 });
    });

    it('should respond with base file for undefined query route', async () => {
      const res = await request.get(helper.getUrl('/internal/v2/route2?dummy=true'));
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ b: 2 });
    });
  });

  describe('Array Parameters', () => {
    it('should respond with dummy-response-2.json for GET with 3 matching params (1 non-array, 2 array)', async () => {
      const res = await request.get(helper.getUrl('/v1/route4?param1=a&param2=c&param2=d'));
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ b: 2 });
    });

    it('should respond with dummy-response-3.json for GET with 4 matching params (2 array, 2 array)', async () => {
      const res = await request.get(helper.getUrl('/v1/route4?param1=a&param1=b&param2=c&param2=d'));
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ c: 3 });
    });

    it('should respond with dummy-response-4.json for GET with 2 matching params (2 array)', async () => {
      const res = await request.get(helper.getUrl('/v1/route4?param2=c&param2=d'));
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ d: 4 });
    });

    it('should respond dummy-response-4.json when GET request has query params but the configuration for queries is undefined', async () => {
      const res = await request.get(helper.getUrl('/no/params?param1=a&param2=b'));
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ d: 4 });
    });
  });

  describe('Regex Parameters', () => {
    it('should respond with dummy-response-2.json for GET with regex pattern', async () => {
      const res = await request.get(helper.getUrl('/v1/route10?a=1'));
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ b: 2 });
    });

    it('should NOT response with dummy-response-2.json for GET with regex pattern', async () => {
      const res = await request.get(helper.getUrl('/v1/route10?a=4'));
      expect(res.status).toBe(200);
      expect(res.body).not.toEqual({ b: 2 });
    });
  });

  describe('Headers', () => {
    it('should respond dummy-response-1.json when GET headers has pair a:1', async () => {
      const res = await request.get(helper.getUrl('/v1/route10')).set('a', '1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ a: 1 });
    });
  });
});
