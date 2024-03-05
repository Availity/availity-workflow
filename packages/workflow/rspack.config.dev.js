import path from 'node:path';

import html from './html';
import resolveModule from './helpers/resolve-module';
import paths from './helpers/paths';
import loaders from './loaders';

process.noDeprecation = true;

export default plugin = (settings) => {
  const resolveApp = (relativePath) => path.resolve(settings.app(), relativePath);

  const config = {
    builtins: {
      html: [html(settings)],
      define: settings.globals(),
      copy: {
        patterns: [
          {
            context: paths.appStatic, // copy from this directory
            from: '**/*', // copy all files
            to: 'static', // copy into {output}/static folder
            noErrorOnMissing: true
          }
        ]
      }
    },

    mode: 'development',

    target: ['web', 'es2020'],

    context: settings.app(),

    // infrastructureLogging: {
    //   level: settings.infrastructureLogLevel()
    // },

    stats: {
      level: settings.statsLogLevel(),
    },

    entry: {
      index: [
        resolveModule(resolveApp, 'index')
      ]
    },
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
        path: require.resolve('path-browserify'),
        url: false
      }
    },

    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx)$/,
          include: settings.include(),
          type: 'javascript/auto'
        },
        {
          test: /\.ts$/,
          include: settings.include(),
          type: 'typescript'
        },
        {
          test: /\.css$/,
          use: [loaders.postcss],
          type: 'css'
        },
        {
          test: /\.s[ac]ss$/,
          use: [loaders.postcss, { loader: 'sass-loader' }],
          type: 'css'
        },
        {
          test: /font\.(woff|woff2|eot|ttf|otf|svg)$/i,
          type: 'asset/resource'
        },
        // allow jsx in js files
        {
          test: /\.js$/,
          include: settings.include(),
          type: 'jsx'
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          type: 'asset/resource'
        }
      ]
    }

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

  return config;
};
