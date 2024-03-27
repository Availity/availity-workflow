import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Inspiration: https://github.com/facebookincubator/create-react-app/blob/master/packages/babel-preset-react-app/index.js

export default (_api, opts) => {
  // This is similar to how `env` works in Babel:
  // https://babeljs.io/docs/usage/babelrc/#env-option
  // We are not using `env` because it’s ignored in versions > babel-core@6.10.4:
  // https://github.com/babel/babel/issues/4539
  // https://github.com/facebook/create-react-app/issues/720
  // It’s also nice that we can enforce `NODE_ENV` being specified.
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;

  if (!opts) {
    opts = {};
  }

  const isEnvProduction = env === 'production';

  return {
    // Don't assume ESM. Check if file is cjs
    sourceType: 'unambiguous',
    presets: [[require.resolve('babel-preset-react-app')]],
    plugins: [
      isEnvProduction && [
        // Remove "data-test-id", "data-testid" attributes from production builds.
        require.resolve('babel-plugin-jsx-remove-data-test-id'),
        {
          attributes: ['data-test-id', 'data-testid']
        }
      ],
      [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
      [
        'babel-plugin-root-import',
        {
          rootPathSuffix: 'project/app',
          rootPathPrefix: '@/'
        }
      ]
    ].filter(Boolean)
  };
};
