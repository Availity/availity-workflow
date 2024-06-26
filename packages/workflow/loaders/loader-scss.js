const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const loaderPostcss = require('./loader-postcss');

module.exports = {
  development: {
    test: /\.(scss|sass)$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          sourceMap: true
        }
      },
      loaderPostcss,
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      }
    ]
  },
  production: {
    test: /\.(scss|sass)$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: 'auto'
        }
      },
      'css-loader',
      loaderPostcss,
      { loader: 'sass-loader', options: { sourceMap: true } }
    ]
  }
};
