const path = require('path');
const webpack = require('webpack');
const settings = require('@availity/workflow-settings');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const loaders = require('@availity/workflow-settings/webpack');
const exists = require('exists-sync');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const requireRelative = require('require-relative');

process.noDeprecation = true;

const htmlConfig = require('./html');

const babelrcPath = path.join(settings.project(), '.babelrc');
const babelrcExists = exists(babelrcPath);

function getVersion() {
  return settings.pkg().version || 'N/A';
}

const config = {
  mode: 'production',

  context: settings.app(),

  entry: {
    index: ['./index.js']
  },

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
          minChunks: 2,
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

  output: {
    path: settings.output(),
    filename: settings.fileName()
  },

  devtool: settings.sourceMap(),

  resolve: {
    // Tell webpack what directories should be searched when resolving modules
    modules: [
      settings.app(),
      'node_modules',
      path.join(settings.project(), 'node_modules'),
      path.join(__dirname, 'node_modules')
    ],
    alias: {
      app: path.resolve(settings.app(), 'app-module')
    },
    symlinks: true,
    extensions: ['.js', '.jsx', '.json', '.css', 'less', 'scss']
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
        test: /\.js$/,
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
      {
        test: requireRelative.resolve('angular', settings.project()),
        use: ['expose-loader?angular', 'exports-loader?angular']
      },
      {
        test: requireRelative.resolve('jquery', settings.project()),
        use: ['expose-loader?$', 'expose-loader?jQuery']
      },
      {
        test: requireRelative.resolve('lodash', settings.project()),
        use: ['expose-loader?_']
      },
      {
        test: requireRelative.resolve('moment', settings.project()),
        use: ['expose-loader?moment']
      },
      {
        test: /\.htm$/,
        use: 'html-loader',
        // Ignore following templates else errors like:
        //    - "window is not defined" error from the html-webpack-plugin
        //    - "The path for file doesn't contains relativeTo param"  from ngtemplate-loader
        exclude: /index\.html/
      },
      {
        test: /\.html$/,
        use: [`ngtemplate-loader?relativeTo=${process.cwd()}/`, 'html-loader'],
        // Ignore following templates else errors like:
        //    - "window is not defined" error from the html-webpack-plugin
        //    - "The path for file doesn't contains relativeTo param"  from ngtemplate-loader
        exclude: /index\.html/
      },
      loaders.css.production,
      loaders.less.production,
      loaders.scss.production,
      loaders.fonts,
      loaders.images
    ]
  },
  plugins: [
    new webpack.DefinePlugin(settings.globals()),

    new webpack.ProvidePlugin({
      'window.jQuery': 'jquery',
      $: 'jquery',
      jQuery: 'jquery'
    }),

    new webpack.BannerPlugin({
      banner: `APP_VERSION=${JSON.stringify(getVersion())};`,
      test: /\.js?/,
      raw: true,
      entryOnly: true
    }),

    new webpack.BannerPlugin({
      banner: `v${getVersion()} - ${new Date().toJSON()}`
    }),

    new HtmlWebpackPlugin(htmlConfig),

    // Ignore all the moment local files
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    new CaseSensitivePathsPlugin(),

    new loaders.MiniCssExtractPlugin({
      filename:'css/index.css',
    }),

    new CopyWebpackPlugin(
      [
        {
          context: `${settings.project()}/project/static`, // copy from this directory
          from: '**/*', // copy all files
          to: 'static' // copy into {output}/static folder
        }
      ],
      {
        debug: 'warning'
      }
    )
  ]
};

if (settings.isProduction()) {
  config.optimization.minimizer.push(
    new UglifyJsPlugin({
      parallel: true,
      uglifyOptions: {
        ie8: false,
        mangle: false,
        warnings: false,
        output: {
          comments: false
        }
      }
    }),
    new OptimizeCSSAssetsPlugin()
  );
}

module.exports = config;
