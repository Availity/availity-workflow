var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BlessPlugin = require('bless-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var autoprefixer = require('autoprefixer');
var NpmImportPlugin = require('less-plugin-npm-import');

var context = require('../context');
var helper = require('./helper');

var wpProjectPath = path.join(process.cwd(), 'project/app');

function getVersion() {
  return context.meta.version;
}

function getPkg() {
  return context.meta.pkg || {};
}

function resolveNpm(componentPath){
  return path.join(process.cwd(), 'node_modules', componentPath);
}


var config = {

  context: wpProjectPath,

  entry: {
    index: helper.entry(),
    vendor: ['vendor']
  },

  output: {
    path: helper.output(),
    filename: helper.fileName(),
    hash: context.settings.isDistribution(),
    pathinfo: context.settings.isDevelopment()
  },

  // devtool: 'source-map' cannot cache SourceMaps for modules and need to regenerate complete SourceMap for the chunk. It’s something for production…
  // devtool: 'eval-source-map' is really as good as devtool: 'source-map', but can cache SourceMaps for modules. It’s much faster for rebuilds.
  // devtool: 'eval-cheap-module-source-map' offers SourceMaps that only maps lines (no column mappings) and are much faster.
  // devtool: 'eval-cheap-source-map' is similar but doesn’t generate SourceMaps for modules (i. e. jsx to js mappings).
  //
  // The best performance has devtool: 'eval', but it only maps to compiled source code per module. In many cases this is good enough. Hint: combine it with output.pathinfo: true.
  // The UglifyJsPlugin uses SourceMaps to map errors to source code. And SourceMaps are slow. As you should only use this in production this is fine. If your production build is really slow (or doesn’t finish at all) you can disable it with new UglifyJsPlugin({ sourceMap: false }).
  devtool: helper.maps(),

  debug: context.settings.isDevelopment(),

  cache: context.settings.isDevelopment(),

  watch: false,

  noParse: [
    /.*bower_components.*/
  ],

  resolve: {
    root: [wpProjectPath],
    modulesDirectories: ['bower_components', 'node_modules'],
    extensions: ['', '.js', '.jsx', '.json', '.css', '.less'],
    alias: {
      'inputmask.dependencyLib': resolveNpm('jquery.inputmask/dist/inputmask/inputmask.dependencyLib.jquery'),
      'inputmask' : resolveNpm('jquery.inputmask/dist/inputmask/inputmask'),
      'jquery.inputmask': resolveNpm('jquery.inputmask/dist/inputmask/jquery.inputmask')
    }
  },

  resolveLoader: {
    root: [
      path.join(__dirname, '../node_modules'),  // local
      path.join(process.cwd(), './node_modules') // parent project
    ]
  },

  module: {
    loaders: [
      { test: /[\\\/]angular\.js$/, loader: 'expose?angular!exports?angular' }, // export angular so we can do `var angular = require('angular')`
      { test: /[\\\/]jquery\.js$/, loader: 'expose?$!expose?jQuery' }, // export jQuery and $ to global scope.
      { test: /[\\\/]lodash\.js$/, loader: 'expose?_' }, // export jQuery and $ to global scope.
      { test: /[\\\/]moment\.js$/, loader: 'expose?moment' },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          cacheDirectory: true
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css', {
          publicPath: '../'
        })
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader!autoprefixer-loader?{browsers: ["last 3 versions", "ie 8", "ie 9", "> 1%"]}!less-loader',
          {
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
      {test: /\.(jpe?g|png|gif)$/, loader: 'file?name=images/[name].[ext]'},
      {
        test: /\.html$/,
        loader: 'ngtemplate?relativeTo=' + process.cwd() + '/!html',
      },
      {test: /\.json$/, loader: 'json-loader'}

    ]
  },

  postcss: function() {
    return [autoprefixer({browsers: ['last 2 versions', 'ie 9-11']})];
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

    new WebpackMd5Hash(),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'],
      minChunks: Infinity
    }),

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      _: 'lodash'
    }),

    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(getVersion())
    }),

    new BlessPlugin({
      imports: true
    }),

    new HtmlWebpackPlugin({
      template: 'project/app/index.html',
      favicon: 'project/app/favicon.ico',
      pkg: getPkg()
    }),

    // Use bundle name for extracting bundle css
    new ExtractTextPlugin('css/' + helper.cssFileName(), {
      allChunks: true
    }),
  ]

};

if (context.settings.isStaging()) {

  config.plugins.push(
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.DedupePlugin(),
    new webpack.NoErrorsPlugin()
  );

}

if (context.settings.isProduction()) {

  config.plugins.push(
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      sourceMap: true,
      compress: {
        drop_console: true,
        warnings: false
      },
      output: {
        comments: false,
        max_line_len: 1000
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.NoErrorsPlugin()
  );

}

module.exports = config;
