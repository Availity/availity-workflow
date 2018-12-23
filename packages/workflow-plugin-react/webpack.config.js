const path = require('path');
const webpack = require('webpack');
const settings = require('@availity/workflow-settings');
const { existsSync } = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const loaders = require('@availity/workflow-settings/webpack');

process.noDeprecation = true;

const htmlConfig = require('./html');

const babelrcPath = path.join(settings.project(), '.babelrc');
const babelrcExists = existsSync(babelrcPath);

function getVersion() {
  return settings.pkg().version || 'N/A';
}

const index = [
  `${require.resolve('webpack-dev-server/client')}?/`,
  require.resolve('webpack/hot/dev-server'),
  './index.js'
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
              presets: [require.resolve('@availity/workflow-babel-preset')],
              cacheDirectory: settings.isDevelopment(),
              babelrc: babelrcExists,
              plugins: [babelrcExists ? null : require.resolve('react-hot-loader/babel')]
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
      test: /\.jsx?/,
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

    new HtmlWebpackPlugin(htmlConfig),

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

if (settings.isHotLoader()) {
  config.module.rules.push({
    test: settings.getHotLoaderEntry(),
    loader: require.resolve('react-hot-loader-loader')
  });
}

if (settings.isNotifications()) {
  config.plugins.push(
    new WebpackNotifierPlugin({
      contentImage: path.join(__dirname, 'availity.png'),
      excludeWarnings: true
    })
  );
}

module.exports = config;
