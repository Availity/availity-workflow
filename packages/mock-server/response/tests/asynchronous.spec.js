const request = require('superagent');
const isEqual = require('lodash/isEqual');

const helper = require('../../tests/helpers');

describe('Asynchronous', () => {
  helper.serverSpecHelper();

  it('should respond with 202 then 201', async () => {
    let res = await request.get(helper.getUrl('/v1/route6'));
    expect(res.status).toBe(202);
    expect(isEqual(res.body, { c: 3 })).toBeTruthy();

    res = await request.get(helper.getUrl('/v1/route6'));
    expect(res.status).toBe(201);
    expect(isEqual(res.body, { d: 4 })).toBeTruthy();
  });

  it('should repeat dummy-response1.json x3, dummy-response2.json x1 then followed by a dummy-response2 x1', async () => {
    let res = await request.get(helper.getUrl('/v1/route8'));
    expect(res.status).toBe(202);
    expect(isEqual(res.body, { a: 1 })).toBeTruthy();

    res = await request.get(helper.getUrl('/v1/route8'));
    expect(res.status).toBe(202);
    expect(isEqual(res.body, { a: 1 })).toBeTruthy();

    res = await request.get(helper.getUrl('/v1/route8'));
    expect(res.status).toBe(202);
    expect(isEqual(res.body, { a: 1 })).toBeTruthy();

    res = await request.get(helper.getUrl('/v1/route8'));
    expect(res.status).toBe(202);
    expect(isEqual(res.body, { b: 2 })).toBeTruthy();

    res = await request.get(helper.getUrl('/v1/route8'));
    expect(res.status).toBe(201);
    expect(isEqual(res.body, { c: 3 })).toBeTruthy();
  });
});
