/* eslint-disable jest/no-try-expect */
/* eslint-disable jest/no-conditional-expect */

import request from 'superagent';
import helper from '../../tests/helpers';

describe('Behavior', () => {
  helper.serverSpecHelper();

  it('should respond with 404 for undefined route', async () => {
    try {
      await request.get(helper.getUrl('/dummy/route'));
    } catch (error) {
      expect(error.status).toBe(404);
    }
  });

  it('should respond with 404 when file does not exist', async () => {
    try {
      await request.get(helper.getUrl('/bad/file'));
    } catch (error) {
      expect(error.status).toBe(404);
    }
  });
});
