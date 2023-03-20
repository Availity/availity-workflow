const path = require('path');

const loaders = require('./loaders');
const resolveModule = require('./helpers/resolve-module');

process.noDeprecation = true;

const plugin = (settings) => {
  const resolveApp = (relativePath) => path.resolve(settings.app(), relativePath);


  function getVersion() {
    return settings.pkg().version || 'N/A';
  }

  const config = {
    mode: 'development',

    target: ['web', 'es2020'],

    context: settings.app(),

    // https://webpack.js.org/configuration/experiments/
    // experiments: settings.experimentalWebpackFeatures(),

    // infrastructureLogging: {
    //   level: settings.infrastructureLogLevel()
    // },

    stats: settings.statsLogLevel(),

    entry: resolveModule(resolveApp, 'index'),

    output: {
      path: settings.output(),
      filename: settings.fileName(),
      chunkFilename: settings.chunkFileName()
    },

    devtool: settings.sourceMap(),

    resolve: {
      // resolve @ path imports to resolve to project/app
      alias: {
        '@': settings.app()
      },
      // Tell webpack what directories should be searched when resolving modules
      modules: [
        settings.app(),
        'node_modules',
        path.join(settings.project(), 'node_modules'),
        path.join(__dirname, 'node_modules')
      ],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss'],
      fallback: {
        path: require.resolve('path-browserify')
      }
    },

    // This set of options is identical to the resolve property set above,
    // but is used only to resolve webpack's loader packages.
    // resolveLoader: {
    //   modules: [path.join(settings.project(), 'node_modules'), path.join(__dirname, 'node_modules')],
    //   symlinks: true
    // },

    module: {
      rules: [
        // solution to process.cwd() is undefined in @availity/spaces -> react-markdown -> vfile
        // https://github.com/remarkjs/react-markdown/issues/339#issuecomment-683199835
        // Needed for @availity/spaces compatibility with Webpack 5
        // {
        //   test: /[/\\]node_modules[/\\]vfile[/\\]core\.js/,
        //   use: [
        //     {
        //       loader: 'imports-loader',
        //       options: {
        //         type: 'commonjs',
        //         imports: ['single process/browser process']
        //       }
        //     }
        //   ]
        // },
        {
          test: /\.(js|mjs|jsx)$/,
          include: settings.include(),
          type: 'javascript/auto',
        },
        {
          test: /\.ts$/,
          include: settings.include(),
          type: 'typescript'
        },

        //   use: [
        //     {
        //       loader: 'babel-loader',
        //       options: {
        //         presets: [babelPreset],
        //         // This is a feature of `babel-loader` for webpack (not Babel itself).
        //         // It enables caching results in ./node_modules/.cache/babel-loader/
        //         // directory for faster rebuilds.
        //         cacheDirectory: settings.isDevelopment(),
        //         // See https://github.com/facebook/create-react-app/issues/6846 for context on why cacheCompression is disabled
        //         cacheCompression: false,
        //         babelrc: babelrcExists,
        //         // TODO: why disable hot loader if babelrc exists?
        //         plugins: [babelrcExists ? null : require.resolve(settings.getHotLoaderName())]
        //       }
        //     }
        //   ]
        // },
        // Allows .mjs and .js files from packages of type "module" to be required without the extension
        // {
        //   test: /\.m?js/,
        //   resolve: {
        //     fullySpecified: false
        //   }
        // },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    "autoprefixer"
                  ]
                }
              }
            }
          ],
          type: 'css'
        },
        {
          test: /\.less$/,
          use: [{ loader: 'less-loader' }],
          type: 'css'
        },
        {
          test: /\.s[ac]ss$/,
          use: [{ loader: 'sass-loader' }],
          type: 'css'
        },
        {
          test: /\.yaml$/,
          use: [{ loader: 'yaml-loader' }]
        },
       
        {
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack'
            },
            {
              loader: 'file-loader'
            }
          ],
          type: 'javascript/auto'
        },
        {
          test: /\.txt/,
          use: [
            {
              loader: 'raw-loader'
            }
          ],
          type:'javascript/auto'
        },
       
        {
          test: /font\.(woff|woff2|eot|ttf|otf|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[ext]'
          }
        },
        // allow jsx in js files
        {
          test: /\.js$/,
          type: 'jsx'
        },
      ]
    },
  
       
  
    //   ]
    // },

    plugins: [

      // new webpack.BannerPlugin({
      //   banner: `APP_VERSION=${JSON.stringify(getVersion())};`,
      //   test: /\.(js|mjs|jsx|ts|tsx)$/,
      //   raw: true,
      //   entryOnly: true
      // }),

      // new webpack.BannerPlugin({
      //   banner: `v${getVersion()} - ${new Date().toJSON()}`
      // }),

      // new DuplicatePackageCheckerPlugin({
      //   verbose: true,
      //   exclude(instance) {
      //     return (
      //       instance.name === 'regenerator-runtime' ||
      //       instance.name === 'unist-util-visit-parents' ||
      //       instance.name === 'scheduler' ||
      //       instance.name === '@babel/runtime'
      //     );
      //   }
      // }),

      // Ignore all the moment local files
      // new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),

      // new ESLintPlugin({
      //   cache: true,
      //   cacheLocation: path.resolve(paths.appNodeModules, '.cache/.eslintcache'),
      //   quiet: false,
      //   emitWarning: true,
      //   extensions: ['js', 'jsx', 'ts', 'tsx', 'mjs'],
      //   baseConfig: {
      //     extends: 'availity/workflow'
      //   }
      // })
    ]
  };

  // if (fs.existsSync(paths.appStatic)) {
  //   config.plugins.push(
  //     new CopyWebpackPlugin({
  //       patterns: [
  //         {
  //           context: paths.appStatic, // copy from this directory
  //           from: '**/*', // copy all files
  //           to: 'static', // copy into {output}/static folder
  //           noErrorOnMissing: false
  //         }
  //       ]
  //     })
  //   );
  // }

  // config.plugins.push(new ReactRefreshWebpackPlugin());

  // if (settings.isNotifications()) {
  //   config.plugins.push(
  //     new WebpackNotifierPlugin({
  //       contentImage: path.join(__dirname, './public/availity.png'),
  //       excludeWarnings: true
  //     })
  //   );
  // }

  // TODO: set up persistent cache options https://webpack.js.org/guides/build-performance/#persistent-cache

  return config;
};

module.exports = plugin;
