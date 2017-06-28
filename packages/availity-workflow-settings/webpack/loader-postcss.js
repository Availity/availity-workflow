const cssnext = require('postcss-cssnext');
const postcssFocus = require('postcss-focus');
const postcssReporter = require('postcss-reporter');

module.exports = {
  loader: 'postcss-loader',
  options: {
    sourceMap: true,
    plugins: () => [
      postcssFocus(),
      cssnext({
        // React doesn't support IE8 anyway
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9'
        ]
      }),
      postcssReporter({
        clearMessages: true
      })
    ]
  }
};
