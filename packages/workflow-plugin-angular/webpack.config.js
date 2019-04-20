const path = require('path');
const webpack = require('webpack');
const { existsSync } = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const loaders = require('@availity/workflow-settings/webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const requireRelative = require('require-relative');

const html = require('./html');

const plugin = settings => {
  const babelrcPath = path.join(settings.project(), '.babelrc');

  const babelrcExists = existsSync(babelrcPath);
  function getVersion() {
    return settings.pkg().version || 'N/A';
  }

  const config = {
    mode: 'development',

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

        loaders.css.development,
        loaders.less.development,
        loaders.scss.development,
        loaders.fonts,
        loaders.images,
        loaders.eslint
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
        test: /\.jsx?/,
        raw: true,
        entryOnly: true
      }),

      new webpack.BannerPlugin({
        banner: `v${getVersion()} - ${new Date().toJSON()}`
      }),

      // Generate hot module chunks
      new webpack.HotModuleReplacementPlugin(),

      new HtmlWebpackPlugin(html(settings)),

      new DuplicatePackageCheckerPlugin({
        verbose: true,
        exclude(instance) {
          return instance.name === 'regenerator-runtime';
        }
      }),

      // Ignore all the moment local files
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      new CaseSensitivePathsPlugin(),

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

  if (settings.isNotifications()) {
    config.plugins.push(
      new WebpackNotifierPlugin({
        contentImage: path.join(__dirname, 'availity.png'),
        excludeWarnings: true
      })
    );
  }

  return config;
};

module.exports = plugin;
