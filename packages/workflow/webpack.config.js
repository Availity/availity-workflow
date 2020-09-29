/* eslint-disable unicorn/no-null */
const path = require('path');
const webpack = require('webpack');
const { existsSync } = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const loaders = require('./loaders');
const babelPreset = require('./babel-preset');
const resolveModule = require('./helpers/resolve-module');
const html = require('./html');

process.noDeprecation = true;

const plugin = settings => {
  const resolveApp = relativePath => path.resolve(settings.app(), relativePath);

  const babelrcPath = path.join(settings.project(), '.babelrc');
  const babelrcExists = existsSync(babelrcPath);

  function getVersion() {
    return settings.pkg().version || 'N/A';
  }

  const index = [
    require.resolve('react-app-polyfill/ie11'),
    `${require.resolve('webpack-dev-server/client')}?/`,
    require.resolve('webpack/hot/dev-server'),
    require.resolve('navigator.sendbeacon'),
    resolveModule(resolveApp, 'index')
  ];

  const config = {
    mode: 'development',

    context: settings.app(),

    entry: {
      index
    },

    output: {
      path: settings.output(),
      filename: settings.fileName(),
      chunkFilename: settings.chunkFileName()
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
      symlinks: true,
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', 'scss']
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
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          include: settings.include(),
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [babelPreset],
                cacheDirectory: settings.isDevelopment(),
                babelrc: babelrcExists,
                plugins: [babelrcExists ? null : require.resolve(settings.getHotLoaderName())]
              }
            }
          ]
        },
        loaders.css.development,
        loaders.scss.development,
        loaders.fonts,
        loaders.images
      ]
    },
    plugins: [
      new webpack.DefinePlugin(settings.globals()),

      new webpack.BannerPlugin({
        banner: `APP_VERSION=${JSON.stringify(getVersion())};`,
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        raw: true,
        entryOnly: true
      }),

      new webpack.BannerPlugin({
        banner: `v${getVersion()} - ${new Date().toJSON()}`
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

      new HtmlWebpackPlugin(html(settings)),
      new DuplicatePackageCheckerPlugin({
        verbose: true,
        exclude(instance) {
          return (
            instance.name === 'regenerator-runtime' ||
            instance.name === 'unist-util-visit-parents' ||
            instance.name === 'scheduler' ||
            instance.name === '@babel/runtime'
          );
        }
      }),

      // Ignore all the moment local files
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      new CaseSensitivePathsPlugin(),
      new ESLintPlugin({ quiet: true }),
      new CopyWebpackPlugin({
        patterns: [
          {
            context: `${settings.app()}/static`, // copy from this directory
            from: '**/*', // copy all files
            to: 'static', // copy into {output}/static folder
            noErrorOnMissing: true
          }
        ]
      })
    ]
  };

  if (settings.getHotLoaderName() === 'react-refresh/babel') {
    config.plugins.push(new ReactRefreshWebpackPlugin());
  }

  if (settings.isNotifications()) {
    config.plugins.push(
      new WebpackNotifierPlugin({
        contentImage: path.join(__dirname, './public/availity.png'),
        excludeWarnings: true
      })
    );
  }

  return config;
};

module.exports = plugin;
