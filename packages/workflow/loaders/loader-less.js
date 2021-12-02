const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const loaderPostcss = require('./loader-postcss');

module.exports = {
  development: {
    test: /\.less$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          importLoaders: 1
        }
      },
      {
        loader: 'less-loader',
        options: {
          sourceMap: false
        }
      }
    ]
  },
  production: {
    test: /\.less$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: 'auto'
        }
      },
      {
        loader: 'css-loader',
        options: { sourceMap: true, importLoaders: 1 }
      },
      loaderPostcss,
      {
        loader: 'less-loader',
        options: { sourceMap: false }
      }
    ]
  }
};
