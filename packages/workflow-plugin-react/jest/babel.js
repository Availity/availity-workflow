// https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/config/jest/babelTransform.js
const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: [require.resolve('@availity/workflow-babel-preset')],
  babelrc: false
});
