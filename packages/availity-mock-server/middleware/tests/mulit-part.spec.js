/* globals describe, it */

const request = require('superagent');
const _ = require('lodash');
const helper = require('../../tests/helpers');

describe('Multi-part', () => {
  helper.serverSpecHelper();

  it('should respond with dummy-response-1.json for empty form fields and one file attachment', async () => {
    const res = await request
      .post(helper.getUrl('/v1/route5'))
      .type('multipart/form-data')
      .attach('attatchment', helper.getFile('dummy-response-1.json'));

    expect(res.status).toBe(200);
    expect(_.isEqual(res.body, { a: 1 })).toBeTruthy();
  });

  it('should respond with dummy-response-2.json for empty form fields and one file attachment', async () => {
    const res = await request
      .post(helper.getUrl('/v1/route5'))
      .type('multipart/form-data')
      .attach('attachment', helper.getFile('dummy-response-2.json'));

    expect(res.status).toBe(200);
    expect(_.isEqual(res.body, { b: 2 })).toBeTruthy();
  });

  it('should respond with dummy-response-2.json for 1 matching form field and one file attachment', async () => {
    const res = await request
      .post(helper.getUrl('/v1/route5'))
      .type('multipart/form-data')
      .attach('attachment', helper.getFile('dummy-response-2.json'))
      .field('a', '1');

    expect(res.status).toBe(200);
    expect(_.isEqual(res.body, { b: 2 })).toBeTruthy();
  });

  it('should respond with dummy-response-3.json for 2 matching form fields and one file attachment', async () => {
    const res = await request
      .post(helper.getUrl('/v1/route5'))
      .type('multipart/form-data')
      .attach('attachment', helper.getFile('dummy-response-3.json'))
      .field('a', '1')
      .field('b', '2');

    expect(res.status).toBe(200);
    expect(_.isEqual(res.body, { c: 3 })).toBeTruthy();
  });

  it('should respond with dummy-response-4.json for field name that matches file input name', async () => {
    const res = await request
      .post(helper.getUrl('/v1/route5'))
      .type('multipart/form-data')
      .attach('attachment', helper.getFile('dummy-response-4.json'))
      .field('a', '1')
      .field('b', '2');

    expect(res.status).toBe(200);
    expect(_.isEqual(res.body, { d: 4 })).toBeTruthy();
  });
});
