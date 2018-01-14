const path = require('path');
const webpack = require('webpack');
const settings = require('availity-workflow-settings');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const exists = require('exists-sync');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const postcss = require('availity-workflow-settings/webpack/loader-postcss');
const ruleFonts = require('availity-workflow-settings/webpack/rule-fonts');

process.noDeprecation = true;

const htmlConfig = require('./html');
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

  devtool: settings.sourceMap(),

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
              presets: [require.resolve('availity-workflow-babel-preset')],
              cacheDirectory: settings.isDevelopment(),
              babelrc: babelrcExists
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: require.resolve('style-loader'),
            options: {
              hmr: false
            }
          },
          use: ['css-loader', postcss],
          publicPath: '../'
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: require.resolve('style-loader'),
            options: {
              hmr: false
            }
          },
          use: ['css-loader', postcss, { loader: 'sass-loader', options: { sourceMap: true } }],
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

    new HtmlWebpackPlugin(htmlConfig),

    // Ignore all the moment local files
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    new CaseSensitivePathsPlugin(),

    new webpack.optimize.ModuleConcatenationPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module) {
        // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),

    new ExtractTextPlugin(`css/${settings.css()}`),

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
  config.plugins.push(
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
    })
  );
}

module.exports = config;
