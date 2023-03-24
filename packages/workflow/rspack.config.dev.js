const path = require('path');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const fs = require('fs');

const html = require('./html')
const resolveModule = require('./helpers/resolve-module');
const paths = require('./helpers/paths');


process.noDeprecation = true;

// function modifyBase(webpackConfig) {
//     return {
//       builtins: webpackConfig.builtins,
//        entry: webpackConfig.entry,
//        output: webpackConfig.output,
//        resolve: webpackConfig.resolve,
//        module: webpackConfig.module,
//        watchOptions: {
//           ignored: /^\.\/locale$/,
//        },
//        context: webpackConfig.context,
//        devtool: webpackConfig.devtool,
//        mode: webpackConfig.mode,
//        target: webpackConfig.target,
//      }
//    }

const plugin = (settings) => {
  const resolveApp = (relativePath) => path.resolve(settings.app(), relativePath);

  const config = {
    builtins: {
        html: [html(settings)],
        define: settings.globals(),
    },
        
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
          test: /\.s[ac]ss$/,
          use: [{ loader: 'sass-loader' }],
          type: 'css'
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
          include: settings.include(),
          type: 'jsx'
        },
      ]
    },
  
       
 

    // plugins: [

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
      // }),
      // new CaseSensitivePathsPlugin(),

    // ]
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
