import { AppStore } from './appStore';

const appStore = new AppStore({});

describe('AppStore', () => {
  it('should be defined accepted agreement', () => {
    expect(appStore).toBeDefined();
  });
});
