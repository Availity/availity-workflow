import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import loaderPostcss from './loader-postcss';

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
  rspack: {
    test: /\.css$/,
    use: ['sass-loader', loaderPostcss],
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
