const request = require('superagent');
const helper = require('../../tests/helpers');

describe('Behavior', () => {
  helper.serverSpecHelper();

  it('should respond with 404 for undefined route', async () => {
    await expect(request.get(helper.getUrl('/dummy/route'))).rejects.toThrow('Not Found');
  });

  it('should respond with 404 when file does not exist', async () => {
    await expect(request.get(helper.getUrl('/bad/file'))).rejects.toThrow('Not Found');
  });
});
