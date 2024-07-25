// https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/config/jest/babelTransform.js
const babelJest = require('babel-jest').default;

const createTransformer = () =>
  babelJest.createTransformer({
    presets: [
      [
        '@babel/preset-react',
        {
          runtime: 'automatic'
        }
      ],
      [
        '@babel/preset-env',
        {
          include: ['@babel/plugin-transform-class-properties']
        }
      ],
      '@babel/preset-typescript'
    ],
    plugins: [
      [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
      [
        'babel-plugin-root-import',
        {
          rootPathSuffix: 'project/app',
          rootPathPrefix: '@/'
        }
      ]
    ],
    babelrc: false
  });

module.exports = {
  createTransformer
};
