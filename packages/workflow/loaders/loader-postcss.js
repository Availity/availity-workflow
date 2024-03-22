export default {
  loader: 'postcss-loader',
  options: {
    sourceMap: true,
    postcssOptions: {
      plugins: [
        'postcss-focus',
        'postcss-flexbugs-fixes',
        ['postcss-preset-env', {
          autoprefixer: {
            flexbox: 'no-2009'
          },
          stage: 3
        }],
        ['postcss-reporter', {
          clearMessages: true
        }]
      ]
    }
  }
};
