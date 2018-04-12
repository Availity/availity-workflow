const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const loaderPostcss = require('./loader-postcss');

module.exports = {
  development: {
    test: /\.s(a|c)ss$/,
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
    test: /\.scss$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: '../'
        }
      },
      'css-loader',
      loaderPostcss,
      { loader: 'sass-loader', options: { sourceMap: true } }
    ]
  }
};
