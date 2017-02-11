const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const settings = require('availity-workflow-settings');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const exists = require('exists-sync');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const htmlConfig = require('./html');
const babelrcPath = path.join(settings.project(), '.babelrc');
const babelrcExists = exists(babelrcPath);


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
    publicPath: '/',
    filename: settings.fileName()
  },

  devtool: settings.tool(),

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
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'postcss-loader',
            'sass-loader?sourceMap'
          ],
          publicPath: '../'
        })
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
        'NODE_ENV': JSON.stringify('production')
      }
    }),

    new HtmlWebpackPlugin(htmlConfig),

    // Ignore all the moment local files
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),

    new CaseSensitivePathsPlugin(),

    new webpack.LoaderOptionsPlugin({
      test: /\.scss$/,
      debug: true,
      options: {
        postcss() {
          return [autoprefixer];
        },
        context: settings.app(),
        output: { path: settings.output() }
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),

    new ExtractTextPlugin(`css/${settings.css()}`),

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

if (settings.isProduction()) {

  config.plugins.push(

    // Minify the code scripts and css
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      compress: {
        screw_ie8: true, // IE8 not supported by Availity
        drop_console: true
      },
      output: {
        comments: false,
        screw_ie8: true,
        max_line_len: 1000
      }
    })
  );

}

module.exports = config;

