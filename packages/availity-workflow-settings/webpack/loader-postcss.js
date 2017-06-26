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
        browsers: ['last 2 versions', 'IE > 10']
      }),
      postcssReporter({
        clearMessages: true
      })
    ]
  }
}
