// https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/config/jest/babelTransform.js
const babelJest = require('babel-jest');
const babelPreset = require('../babel-preset');

const createTransformer = () => {
  return babelJest.createTransformer({
    presets: [babelPreset],
    babelrc: false
  });
};

module.exports = {
  createTransformer
};
