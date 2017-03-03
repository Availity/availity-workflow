const path = require('path');
const webpack = require('webpack');
const settings = require('availity-workflow-settings');
const exists = require('exists-sync');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

process.noDeprecation = true;

const htmlConfig = require('./html');
const VersionPlugin = require('./version');
const postCssLoader = require('./postcss');

const babelrcPath = path.join(settings.project(), '.babelrc');
const babelrcExists = exists(babelrcPath);

function getVersion() {
  return settings.pkg().version || 'N/A';
}

const config = {

  context: settings.app(),

  entry: {
    'index': [
      'react-hot-loader/patch', // Patches React.createElement in dev
      `webpack-dev-server/client?http://localhost:${settings.port()}`, // Enables websocket
      'webpack/hot/only-dev-server', // performs HMR in brwoser
      './index.js'
    ],
    'vendor': [
      './vendor.js'
    ]
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
      path.join(settings.project(), 'node_modules'),
      path.join(__dirname, 'node_modules')
    ],
    symlinks: true,
    extensions: ['.js', '.jsx', '.json', '.css', 'scss']
  },

  // This set of options is identical to the resolve property set above,
  // but is used only to resolve webpack's loader packages.
  resolveLoader: {
    modules: [
      path.join(settings.project(), 'node_modules'),
      path.join(__dirname, 'node_modules')
    ],
    symlinks: true
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: settings.app(),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                require.resolve('availity-workflow-babel-preset')
              ],
              cacheDirectory: settings.isDevelopment(),
              babelrc: babelrcExists,
              plugins: [
                babelrcExists ? null : require.resolve('react-hot-loader/babel')
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          postCssLoader
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          postCssLoader,
          'sass-loader'
        ]
      },
      {
        // test should match the following:
        //
        //  '../fonts/availity-font.eot?18704236'
        //  '../fonts/availity-font.eot'
        //
        test: /\.(otf|ttf|woff2?|eot|svg)(\?.*)?$/,
        use: [
          'file-loader?name=fonts/[name].[ext]'
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'url-loader?name=images/[name].[ext]&limit=10000'
        ]
      }
    ]
  },
  plugins: [

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),

    new VersionPlugin({
      version: JSON.stringify(getVersion())
    }),

    // Converts:
    //    [HMR] Updated modules:
    //    [HMR]  - 5
    // To:
    //    [HMR] Updated modules:
    //    [HMR]  - ./src/middleware/api.js
    new webpack.NamedModulesPlugin(),

    // Generate hot module chunks
    new webpack.HotModuleReplacementPlugin(),

    new HtmlWebpackPlugin(htmlConfig),

    // Ignore all the moment local files
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),

    new CaseSensitivePathsPlugin(),

    new CopyWebpackPlugin([
      {
        context: `${settings.project()}/project/static`, // copy from this directory
        from: '**/*', // copy all files
        to: 'static' // copy into {output}/static folder
      }
    ], {
      debug: 'warning'
    })

  ]
};

if (settings.isNotifications()) {
  config.plugins.push(new WebpackNotifierPlugin({
    contentImage: path.join(__dirname, 'availity.png'),
    excludeWarnings: true
  }));
}

module.exports = config;

