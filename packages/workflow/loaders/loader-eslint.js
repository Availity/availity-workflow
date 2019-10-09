module.exports = {
  loader: 'eslint-loader',
  exclude: /node_modules/,
  enforce: 'pre',
  test: /\.(js|mjs|jsx|ts|tsx)$/,
  options: {
    emitWarning: true,
    baseConfig: {
      extends: 'eslint-config-availity'
    },
    settings: {
      'import/resolver': {
        'babel-plugin-root-import': {
          rootPathSuffix: 'project/app',
          rootPathPrefix: '@/'
        }
      }
    }
  }
};
