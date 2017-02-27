const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const settings = require('availity-workflow-settings');
const exists = require('exists-sync');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const NpmImportPlugin = require('less-plugin-npm-import');
const requireRelative = require('require-relative');

const htmlConfig = require('./html');
const VersionPlugin = require('./version');
const postcss = require('./postcss');

const babelrcPath = path.join(settings.project(), '.babelrc');
const babelrcExists = exists(babelrcPath);

function getVersion() {
  return settings.pkg().version || 'N/A';
}

const config = {

  context: settings.app(),

  entry: {
    'index': [
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

    alias: {
      app: path.resolve(settings.app(), 'app-module')
    },

    symlinks: true,
    extensions: ['.js', '.jsx', '.json', '.css', 'less', 'scss']
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
        test: /\.js$/,
        include: settings.app(),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                require.resolve('availity-workflow-babel-preset')
              ],
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
        use: [
          `ngtemplate-loader?relativeTo=${process.cwd()}/`,
          'html-loader'
        ],
        // Ignore following templates else errors like:
        //    - "window is not defined" error from the html-webpack-plugin
        //    - "The path for file doesn't contains relativeTo param"  from ngtemplate-loader
        exclude: /index\.html/
      },
      {
        test: requireRelative.resolve('angular', settings.project()),
        use: [
          'expose-loader?angular',
          'exports-loader?angular'
        ]
      },
      {
        test: requireRelative.resolve('jquery', settings.project()),
        use: [
          'expose-loader?$',
          'expose-loader?jQuery'
        ]
      },
      {
        test: requireRelative.resolve('lodash', settings.project()),
        use: [
          'expose-loader?_'
        ]
      },
      {
        test: requireRelative.resolve('moment', settings.project()),
        use: [
          'expose-loader?moment'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          postcss
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          postcss,
          'less-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader?name=images/[name].[ext]',
          postcss,
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

    new webpack.ProvidePlugin({
      'window.jQuery': 'jquery',
      '$': 'jquery',
      'jQuery': 'jquery'
    }),

    new VersionPlugin({
      version: JSON.stringify(getVersion())
    }),

    // Generate hot module chunks
    new webpack.HotModuleReplacementPlugin(),

    new HtmlWebpackPlugin(htmlConfig),

    // Ignore all the moment local files
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),

    new CaseSensitivePathsPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),

    new webpack.LoaderOptionsPlugin(
      {
        test: /\.less$/,
        debug: true,
        options: {
          postcss: [
            autoprefixer({ browsers: ['last 5 versions'] })
          ],
          lessPlugins: [
            new NpmImportPlugin({
              prefix: '~'
            })
          ],
          context: settings.app(),
          output: { path: settings.output() }
        }
      }
    ),

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

