const path = require('path');
const webpack = require('webpack');
const settings = require('@availity/workflow-settings');
const { existsSync } = require('fs');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const loaders = require('@availity/workflow-settings/webpack');

process.noDeprecation = true;

const babelrcPath = path.join(settings.project(), '.babelrc');
const babelrcExists = existsSync(babelrcPath);

function getVersion() {
  return settings.pkg().version || 'N/A';
}

const config = {
  context: settings.app(),

  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        },
        commons: {
          chunks: 'initial',
          minChunks: 2
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true
        }
      }
    },
    minimizer: []
  },

  entry: {
    index: ['./index.js']
  },

  output: {
    path: settings.output(),
    filename: settings.fileName()
  },

  devtool: 'cheap-module-source-map',

  resolve: {
    // Tell webpack what directories should be searched when resolving modules
    modules: [
      settings.app(),
      'node_modules',
      path.join(settings.project(), 'node_modules'),
      path.join(__dirname, 'node_modules')
    ],
    symlinks: true,
    extensions: ['.js', '.jsx', '.json', '.css', 'scss']
  },

  // This set of options is identical to the resolve property set above,
  // but is used only to resolve webpack's loader packages.
  resolveLoader: {
    modules: [path.join(settings.project(), 'node_modules'), path.join(__dirname, 'node_modules')],
    symlinks: true
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: settings.include(),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [require.resolve('@availity/workflow-babel-preset')],
              cacheDirectory: settings.isDevelopment(),
              babelrc: babelrcExists
            }
          }
        ]
      },

      loaders.css.production,
      loaders.scss.production,
      loaders.fonts,
      loaders.images
    ]
  },
  plugins: [
    new webpack.DefinePlugin(settings.globals('')),

    new webpack.BannerPlugin({
      banner: `APP_VERSION=${JSON.stringify(getVersion())};`,
      test: /\.jsx?/,
      raw: true,
      entryOnly: true
    }),

    new webpack.BannerPlugin({
      banner: `v${getVersion()} - ${new Date().toJSON()}`
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'profile.html'
    }),

    new loaders.MiniCssExtractPlugin({
      filename: 'css/[name]-[contenthash].css'
    }),

    new DuplicatePackageCheckerPlugin(),

    // Ignore all the moment local files
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    new CaseSensitivePathsPlugin()
  ]
};

module.exports = config;
