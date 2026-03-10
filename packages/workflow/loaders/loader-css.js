import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import loaderPostcss from './loader-postcss.js';

export default {
  development: {
    test: /\.css$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          importLoaders: 1
        }
      },
      loaderPostcss
    ]
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
