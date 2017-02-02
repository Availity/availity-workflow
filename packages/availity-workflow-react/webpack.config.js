const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const settings = require('availity-workflow-settings');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const babelQuery = require('./babel');
const htmlConfig = require('./html');

module.exports = {

  context: settings.app(),

  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:${settings.port()}`,
    'webpack/hot/only-dev-server',
    './index.js'

  ],

  output: {
    path: settings.output(),
    publicPath: '/',
    filename: settings.fileName()
  },

  devtool: 'eval',

  resolve: {
    root: [settings.app()],
    // resolve.fallback A directory (or array of directories absolute paths),
    // in which webpack should look for modules that weren’t found in
    // resolve.root or resolve.modulesDirectories.  This also helps with
    // npm link of availity-workflow inside other projects.
    fallback: path.join(__dirname, 'node_modules'),
    modulesDirectories: ['node_modules'],
    extensions: settings.extensions()

  },

  resolveLoader: {
    root: [
      path.join(__dirname, '../node_modules'),  // local
      path.join(process.cwd(), './node_modules') // parent project
    ],
    fallback: path.join(__dirname, 'node_modules')
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        include: settings.app(),
        loader: 'babel-loader',
        query: babelQuery
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader?sourceMap'
      },
      {
        // test should match the following:
        //
        //  '../fonts/availity-font.eot?18704236'
        //  '../fonts/availity-font.eot'
        //
        test: /\.(otf|ttf|woff2?|eot|svg)(\?.*)?$/,
        loader: 'file?name=fonts/[name].[ext]'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url-loader?name=images/[name].[ext]&limit=10000'
      }
    ]
  },
  plugins: [

    // Converts:
    //    [HMR] Updated modules:
    //    [HMR]  - 5
    // To:
    //    [HMR] Updated modules:
    //    [HMR]  - ./src/middleware/api.js
    new webpack.NamedModulesPlugin(),

    new webpack.HotModuleReplacementPlugin(),

    new HtmlWebpackPlugin(htmlConfig),

    // ignore all the moment local files
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
    })
  ]
};

