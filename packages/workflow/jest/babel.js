// https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/config/jest/babelTransform.js
import babelJest from 'babel-jest';
import babelPreset from '../babel-preset';

export const createTransformer = () =>
  babelJest.createTransformer({
    presets: [babelPreset],
    babelrc: false
  });
