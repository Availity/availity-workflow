import postcssFocus from 'postcss-focus';
import postcssReporter from 'postcss-reporter';
import postcssFlexBugs from 'postcss-flexbugs-fixes';
import postCssEnv from 'postcss-preset-env'; // TODO: latest release two years ago, keep?

export default {
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
