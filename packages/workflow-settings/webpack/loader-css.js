const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const loaderPostcss = require('./loader-postcss');

module.exports = {
  development: {
    test: /\.css$/,
    use: [
      'style-loader',
      loaderPostcss,
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          importLoaders: 1,
          name: 'images/[name].[ext]'
        }
      }
    ]
  },
  production: {
    test: /\.css$/,
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
      loaderPostcss
    ]
  }
};
