const path = require('path');
const webpack = require('webpack');
const settings = require('availity-workflow-settings');
const exists = require('exists-sync');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const requireRelative = require('require-relative');

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
    publicPath: '/',
    filename: settings.fileName()
  },

  devtool: 'inline-source-map',

  performance: {
    hints: false
  },

  resolve: {
    // Tell webpack what directories should be searched when resolving modules
    modules: [settings.app(), path.join(settings.project(), 'node_modules'), path.join(__dirname, 'node_modules')],

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
        include: [settings.app(), /node_modules(\/|\\)(?=@availity.*).*/],
        enforce: 'pre',
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
        use: ['null-loader']
      },
      {
        test: /\.less$/,
        use: ['null-loader']
      },
      {
        test: /\.scss$/,
        use: ['null-loader']
      },
      {
        // test should match the following:
        //
        //  '../fonts/availity-font.eot?18704236'
        //  '../fonts/availity-font.eot'
        //
        test: /\.(otf|ttf|woff2?|eot|svg)(\?.*)?$/,
        use: ['null-loader']
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: ['null-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(settings.globals()),

    new webpack.ProvidePlugin({
      'window.jQuery': 'jquery',
      $: 'jquery',
      jQuery: 'jquery'
    }),

    new VersionPlugin({
      version: JSON.stringify(getVersion())
    }),

    // Ignore all the moment local files
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    new CaseSensitivePathsPlugin()
  ]
};

module.exports = config;
