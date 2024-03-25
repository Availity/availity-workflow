import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import loaderPostcss from './loader-postcss.js';

export default {
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
  rspack: {
    test: /\.s[ac]ss$/,
    use: [
      {
        loader: 'sass-loader'
      },
      loaderPostcss
    ],
    type: 'css'
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
