// https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/config/jest/babelTransform.js
const babelJest = require('babel-jest');

const createTransformer = settings => {
  console.log('settings');
  return babelJest.createTransformer({
    presets: [[require.resolve('@availity/workflow-babel-preset'), settings]],
    babelrc: false
  });
};

module.exports = {
  createTransformer
};
