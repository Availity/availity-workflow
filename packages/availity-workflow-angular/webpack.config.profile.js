const path = require('path');
const webpack = require('webpack');
const settings = require('availity-workflow-settings');
const exists = require('exists-sync');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const requireRelative = require('require-relative');
const ruleFonts = require('availity-workflow-settings/webpack/rule-fonts');
const loaderPostcss = require('availity-workflow-settings/webpack/loader-postcss');

process.noDeprecation = true;

const VersionPlugin = require('./version');

const babelrcPath = path.join(settings.project(), '.babelrc');
const babelrcExists = exists(babelrcPath);

function getVersion() {
  return settings.pkg().version || 'N/A';
}

const config = {
  context: settings.app(),

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
    modules: [settings.app(), path.join(settings.project(), 'node_modules'), path.join(__dirname, 'node_modules')],
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
              presets: [require.resolve('availity-workflow-babel-preset-angular')],
              cacheDirectory: settings.isDevelopment(),
              babelrc: babelrcExists
            }
          }
        ]
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
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', loaderPostcss],
          publicPath: '../'
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', loaderPostcss, 'less-loader'],
          publicPath: '../'
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', loaderPostcss, 'sass-loader'],
          publicPath: '../'
        })
      },
      ruleFonts,
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: ['url-loader?name=images/[name].[ext]&limit=10000']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(settings.globals()),

    new VersionPlugin({
      version: JSON.stringify(getVersion())
    }),

    new webpack.ProvidePlugin({
      'window.jQuery': 'jquery',
      $: 'jquery',
      jQuery: 'jquery'
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'profile.html'
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module) {
        // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),

    new ExtractTextPlugin(`css/${settings.css()}`),

    new DuplicatePackageCheckerPlugin(),

    // Ignore all the moment local files
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    new CaseSensitivePathsPlugin()
  ]
};

module.exports = config;
