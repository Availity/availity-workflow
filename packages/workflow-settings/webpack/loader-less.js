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
          importLoaders: 1,
          name: 'images/[name].[ext]'
        }
      },
      {
        loader: 'less-loader',
        options: {
          sourceMap: true
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
          publicPath: '../'
        }
      },
      {
        loader: 'css-loader',
        options: { sourceMap: true, importLoaders: 1 }
      },
      loaderPostcss,
      {
        loader: 'less-loader',
        options: { sourceMap: true, }
      }
    ]
  }
};
