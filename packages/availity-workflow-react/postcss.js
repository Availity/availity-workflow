const autoprefixer = require('autoprefixer');
const settings = require('availity-workflow-settings');

const postCssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap: true,
    plugins() {
      return [
        autoprefixer({ browsers: ['last 5 versions'] })
      ];
    }
  }
};

module.exports = postCssLoader;
