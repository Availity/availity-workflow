module.exports = {
  loader: 'eslint-loader',
  exclude: /node_modules/,
  enforce: 'pre',
  test: /\.(js|mjs|jsx|ts|tsx)$/,
  options: {
    emitWarning: true,
    baseConfig: {
      extends: 'eslint-config-availity/workflow'
    },
    rules: {
      // FIXME we really need to find the right eslint config for this
      'import/no-unresolved': [2, { ignore: ['@/'] }]
    }
  }
};
