const mocks = require('./');

describe('mock data', () => {
  it('should be defined', () => {
    expect(mocks.data).toBeDefined();
    expect(mocks.routes).toBeDefined();
  });
});
