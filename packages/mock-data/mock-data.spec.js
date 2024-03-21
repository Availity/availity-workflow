import { data, routes } from '.';

describe('mock data', () => {
  it('should be defined', () => {
    expect(data).toBeDefined();
    expect(routes).toBeDefined();
  });
});
