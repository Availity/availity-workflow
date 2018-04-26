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
        browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 11']
      }),
      postcssReporter({
        clearMessages: true
      })
    ]
  }
};
