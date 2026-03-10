import request from 'superagent';

import helper from '../../tests/helpers.js';

describe('Asynchronous', () => {
  helper.serverSpecHelper();

  it('should respond with 202 then 201', async () => {
    let res = await request.get(helper.getUrl('/v1/route6'));
    expect(res.status).toBe(202);
    expect(res.body).toEqual({ c: 3 });

    res = await request.get(helper.getUrl('/v1/route6'));
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ d: 4 });
  });

  it('should repeat dummy-response1.json x3, dummy-response2.json x1 then followed by a dummy-response2 x1', async () => {
    let res = await request.get(helper.getUrl('/v1/route8'));
    expect(res.status).toBe(202);
    expect(res.body).toEqual({ a: 1 });

    res = await request.get(helper.getUrl('/v1/route8'));
    expect(res.status).toBe(202);
    expect(res.body).toEqual({ a: 1 });

    res = await request.get(helper.getUrl('/v1/route8'));
    expect(res.status).toBe(202);
    expect(res.body).toEqual({ a: 1 });

    res = await request.get(helper.getUrl('/v1/route8'));
    expect(res.status).toBe(202);
    expect(res.body).toEqual({ b: 2 });

    res = await request.get(helper.getUrl('/v1/route8'));
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ c: 3 });
  });
});
