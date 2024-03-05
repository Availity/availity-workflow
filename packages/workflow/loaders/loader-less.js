import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import loaderPostcss from './loader-postcss';

export default {
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
