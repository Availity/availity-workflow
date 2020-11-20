const path = require('path');
const webpack = require('webpack');
const { existsSync } = require('fs');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const loaders = require('./loaders');
const resolveModule = require('./helpers/resolve-module');
const babelPreset = require('./babel-preset');

process.noDeprecation = true;

const plugin = (settings) => {
  const babelrcPath = path.join(settings.project(), '.babelrc');
  const babelrcExists = existsSync(babelrcPath);
  const resolveApp = (relativePath) => path.resolve(settings.app(), relativePath);

  function getVersion() {
    return settings.pkg().version || 'N/A';
  }

  const config = {
    context: settings.app(),

    mode: 'production',

    optimization: {
      minimizer: []
    },

    entry: {
      index: [
        require.resolve('react-app-polyfill/ie11'),
        require.resolve('navigator.sendbeacon'),
        resolveModule(resolveApp, 'index')
      ]
    },

    output: {
      path: settings.output(),
      filename: settings.fileName()
    },

    devtool: 'cheap-module-source-map',

    resolve: {
      // Tell webpack what directories should be searched when resolving modules
      modules: [
        settings.app(),
        'node_modules',
        path.join(settings.project(), 'node_modules'),
        path.join(__dirname, 'node_modules')
      ],
      symlinks: true,
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', 'scss'],
      fallback: {
        path: require.resolve('path-browserify')
      }
    },

    // This set of options is identical to the resolve property set above,
    // but is used only to resolve webpack's loader packages.
    resolveLoader: {
      modules: [path.join(settings.project(), 'node_modules'), path.join(__dirname, 'node_modules')],
      symlinks: true
    },

    module: {
      rules: [
        // solution to process.cwd() is undefined in @availity/spaces -> react-markdown -> vfile
        // https://github.com/remarkjs/react-markdown/issues/339#issuecomment-683199835
        // Needed for @availity/spaces compatibility with Webpack 5
        {
          test: /node_modules\/vfile\/core\.js/,
          use: [
            {
              loader: 'imports-loader',
              options: {
                type: 'commonjs',
                imports: ['single process/browser process']
              }
            }
          ]
        },
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          include: settings.include(),
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [babelPreset],
                cacheDirectory: settings.isDevelopment(),
                babelrc: babelrcExists
              }
            }
          ]
        },
        // Allows .mjs and .js files from packages of type "module" to be required without the extension
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false
          }
        },
        loaders.css.production,
        loaders.scss.production,
        loaders.fonts,
        loaders.images
      ]
    },
    plugins: [
      new webpack.DefinePlugin(settings.globals('')),

      new webpack.BannerPlugin({
        banner: `APP_VERSION=${JSON.stringify(getVersion())};`,
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        raw: true,
        entryOnly: true
      }),

      new webpack.BannerPlugin({
        banner: `v${getVersion()} - ${new Date().toJSON()}`
      }),

      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'profile.html'
      }),

      new loaders.MiniCssExtractPlugin({
        filename: 'css/[name]-[contenthash].css'
      }),

      new DuplicatePackageCheckerPlugin({
        exclude(instance) {
          return instance.name === 'regenerator-runtime';
        }
      }),

      // Ignore all the moment local files
      new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),

      new CaseSensitivePathsPlugin()
    ]
  };

  return config;
};

module.exports = plugin;
