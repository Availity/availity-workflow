const autoprefixer = require('autoprefixer');

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
