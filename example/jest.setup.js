// Mock createSelectorCreator for compatibility with older MUI packages
jest.mock('reselect', () => {
  const actual = jest.requireActual('reselect');
  return {
    ...actual,
    createSelectorCreator:
      actual.createSelectorCreator ||
      function (...args) {
        return actual.createSelector;
      },
  };
});
