const postcssFocus = require('postcss-focus');
const postcssReporter = require('postcss-reporter');
const postcssFlexBugs = require('postcss-flexbugs-fixes');
const postCssEnv = require('postcss-preset-env'); // TODO: latest release two years ago, keep?

module.exports = {
  loader: 'postcss-loader',
  options: {
    sourceMap: true,
    postcssOptions: {
      plugins: [
        postcssFocus(),
        postcssFlexBugs(),
        postCssEnv({
          autoprefixer: {
            flexbox: 'no-2009'
          },
          stage: 3
        }),
        postcssReporter({
          clearMessages: true
        })
      ]
    }
  }
};
