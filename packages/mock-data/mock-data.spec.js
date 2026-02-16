import mocks from './index.js';

describe('mock data', () => {
  it('should be defined', () => {
    expect(mocks.data).toBeDefined();
    expect(mocks.routes).toBeDefined();
  });
});
