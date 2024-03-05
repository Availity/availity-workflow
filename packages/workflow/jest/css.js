// https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/config/jest/cssTransform.js

export default {
  process() {
    return 'export default {};';
  },
  getCacheKey() {
    // The output is always the same.
    return 'cssTransform';
  }
};
