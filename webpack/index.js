'use strict';

const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const WebpackMd5Hash = require('webpack-md5-hash');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

const autoprefixer = require('autoprefixer');
const NpmImportPlugin = require('less-plugin-npm-import');

const settings = require('../settings');
const babelQuery = require('./babel');
const VersionPlugin = require('./plugins/version');
const angularLoaders = require('./loaders/angular');

function getVersion() {
  return settings.version || 'N/A';
}

function getPkg() {
  return settings.pkg || {};
}

const config = {

  context: settings.app(),

  entry: settings.entry(),

  output: {
    path: settings.output(),
    filename: settings.fileName(),
    hash: settings.isDistribution(),
    pathinfo: settings.isDevelopment()
  },

  // devtool: 'source-map' cannot cache SourceMaps for modules and need to regenerate complete SourceMap for the chunk. It’s something for production…
  // devtool: 'eval-source-map' is really as good as devtool: 'source-map', but can cache SourceMaps for modules. It’s much faster for rebuilds.
  // devtool: 'eval-cheap-module-source-map' offers SourceMaps that only maps lines (no column mappings) and are much faster.
  // devtool: 'eval-cheap-source-map' is similar but doesn’t generate SourceMaps for modules (i. e. jsx to js mappings).
  //
  // The best performance has devtool: 'eval', but it only maps to compiled source code per module. In many cases this is good enough. Hint: combine it with output.pathinfo: true.
  // The UglifyJsPlugin uses SourceMaps to map errors to source code. And SourceMaps are slow. As you should only use this in production this is fine. If your production build is really slow (or doesn’t finish at all) you can disable it with new UglifyJsPlugin({ sourceMap: false }).
  devtool: settings.maps(),

  debug: settings.isDevelopment(),

  cache: settings.isDevelopment(),

  watch: settings.isDevelopment(),

  resolve: {
    root: [settings.app()],
    // resolve.fallback A directory (or array of directories absolute paths),
    // in which webpack should look for modules that weren’t found in
    // resolve.root or resolve.modulesDirectories.  This also helps with
    // npm link of availity-workflow inside other projects.
    fallback: path.join(__dirname, 'node_modules'),
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx', '.json', '.css', '.less', 'scss']

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
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /(bower_components|node_modules)/,
        query: babelQuery
      },
      {
        test: /(\.less|\.css)$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css?name=images/[name].[ext]!postcss!less',
          {
            // Path relative to the app root
            publicPath: '../'
          }
        ),
        exclude: [/select2.*\.(png|gif)$/]
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css?!postcss!sass',
          {
            // Path relative to the app root
            publicPath: '../'
          }
        )
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
        // "url" loader works just like "file" loader but it also embeds
        // assets smaller than specified size as data URLs to avoid requests.
        test: /\.(jpe?g|png|gif)$/,
        loader: 'url-loader?name=images/[name].[ext]&limit=10000'
      },
      {
        test: /\.json$/,
        loader: 'json'
      }

    ]
  },

  postcss() {
    return [
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'not ie < 9'
        ]
      })
    ];
  },

  lessLoader: {
    lessPlugins: [
      new NpmImportPlugin({
        prefix: '~'
      })
    ]
  },

  plugins: [

    // ignore all the moment local files
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),

    new CommonsChunkPlugin({
      name: ['vendor'],
      minChunks: Infinity
    }),

    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(getVersion())
    }),

    new CaseSensitivePathsPlugin(),

    // Use bundle name for extracting bundle css
    new ExtractTextPlugin(`css/${settings.css()}`),

    new HtmlWebpackPlugin({
      template: settings.template(),
      favicon: settings.favicon(),
      pkg: getPkg()
    })

  ]

};

if (settings.isAngular()) {
  config.module.loaders.push(angularLoaders);

  config.resolve.alias = config.resolve.alias || {};
  try {
    config.resolve.alias.jquery = require.resolve('jquery');
  } catch (err) {
    // no op
  }


}

if (settings.config().development.notifications) {
  config.plugins.push(new WebpackNotifierPlugin({
    excludeWarnings: true
  }));
}

if (settings.isDistribution()) {

  config.plugins.push(

    // This helps ensure the builds are consistent if source hasn't changed
    new webpack.optimize.OccurenceOrderPlugin(true),

    new WebpackMd5Hash(),

    new VersionPlugin({
      version: JSON.stringify(getVersion())
    }),

    new webpack.optimize.DedupePlugin(),

    new webpack.NoErrorsPlugin()

  );

}

if (settings.isProduction()) {

  config.plugins.push(

    // Minify the code scripts and css
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      sourceMap: false,
      compress: {
        screw_ie8: true, // IE8 not supported in Angular, React and Availity
        drop_console: true,
        warnings: false
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
