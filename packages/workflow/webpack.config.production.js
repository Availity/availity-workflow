/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const loaders = require('./loaders');
const babelPreset = require('./babel-preset');
const resolveModule = require('./helpers/resolve-module');
const html = require('./html');

process.noDeprecation = true;

const plugin = (settings) => {
  const babelrcPath = path.join(settings.project(), '.babelrc');
  const babelrcExists = fs.existsSync(babelrcPath);
  const resolveApp = (relativePath) => path.resolve(settings.app(), relativePath);

  function getVersion() {
    return settings.pkg().version || 'N/A';
  }

  const config = {
    mode: 'production',

    context: settings.app(),

    entry: {
      index: [
        require.resolve('react-app-polyfill/ie11'),
        require.resolve('navigator.sendbeacon'),
        resolveModule(resolveApp, 'index')
      ]
    },

    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            idHint: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          },
          commons: {
            chunks: 'initial',
            minChunks: 2
          },
          defaultVendors: {
            test: /node_modules/,
            chunks: 'initial',
            idHint: 'defaultVendors',
            priority: 10,
            enforce: true
          }
        }
      },
      minimizer: []
    },

    output: {
      path: settings.output(),
      filename: settings.fileName(),
      chunkFilename: settings.chunkFileName(),
      devtoolModuleFilenameTemplate: (info) =>
        `webpack:///${path.relative(settings.project(), info.absoluteResourcePath)}${
          info.loaders ? `?${info.loaders}` : ''
        }`
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

      new HtmlWebpackPlugin(html(settings)),

      // Ignore all the moment local files
      new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),

      new CaseSensitivePathsPlugin(),

      new loaders.MiniCssExtractPlugin({
        filename: 'css/[name]-[contenthash].css'
      }),

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

  if (settings.isProduction() && !settings.shouldMimicStaging) {
    config.optimization.minimizer.push(
      new TerserPlugin({
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true
          }
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: { zindex: false, reduceIdents: false }
      })
    );
  }

  return config;
};

module.exports = plugin;
