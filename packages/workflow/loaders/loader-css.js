const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const loaderPostcss = require('./loader-postcss');

module.exports = {
  development: {
    test: /\.css$/,
    use: [
      // set sass-loader options to strip default parameters
      {loader: 'sass-loader'
        },
      loaderPostcss
    ],
    type: 'css'
  },
  production: {
    test: /\.css$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: 'auto'
        }
      },
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          importLoaders: 1
        }
      },
      loaderPostcss
    ]
  }
};
