import fs from 'node:fs';
import path from 'node:path';
import webpack from 'webpack';
import _merge from 'lodash/merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackNotifierPlugin from 'webpack-notifier';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import loaders from './loaders';
import paths from './helpers/paths';
import resolveModule from './helpers/resolve-module';
import html from './html';
import * as url from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

process.noDeprecation = true;

export const buildBaseConfig = (settings) => {
  const resolveApp = (relativePath) => path.resolve(settings.app(), relativePath);

  function getVersion() {
    return settings.pkg().version || 'N/A';
  }

  const config = {
      context: settings.app(),
        // https://webpack.js.org/configuration/experiments/
    experiments: settings.experimentalWebpackFeatures(),
    infrastructureLogging: {
      level: settings.infrastructureLogLevel()
    },
    entry: {
      index: [
        require.resolve('react-app-polyfill/stable'),
        require.resolve('navigator.sendbeacon'),
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
      // Tell webpack what directories should be searched when resolving modules
      modules: [
        settings.app(),
        'node_modules',
        path.join(settings.project(), 'node_modules'),
        path.join(__dirname, 'node_modules')
      ],
      symlinks: true,
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss'],
      fallback: {
        path: require.resolve('path-browserify')
      },
      plugins: [new TsconfigPathsPlugin({extensions: [".js", ".jsx", ".ts", ".tsx"]})]
    },
     // This set of options is identical to the resolve property set above,
    // but is used only to resolve webpack's loader packages.
    resolveLoader: {
      modules: [path.join(settings.project(), 'node_modules'), path.join(__dirname, 'node_modules')],
      symlinks: true
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

      new HtmlWebpackPlugin(html(settings)),
        // Ignore all the moment local files
        new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),

        new CaseSensitivePathsPlugin(),
    ]
  }
  return config
}
export default plugin = (settings) => {

  const configBase = buildBaseConfig(settings)

  const overrides = {
    mode: 'development',

    target: settings.developmentTargets(),

    stats: settings.statsLogLevel(),

    module: {
      rules: [
        // solution to process.cwd() is undefined in @availity/spaces -> react-markdown -> vfile
        // https://github.com/remarkjs/react-markdown/issues/339#issuecomment-683199835
        // Needed for @availity/spaces compatibility with Webpack 5
        {
          test: /[/\\]node_modules[/\\]vfile[/\\]core\.js/,
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
              loader: 'esbuild-loader',
              options: {
                loader: 'tsx',
                target: 'es2015',
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
        loaders.css.development,
        loaders.scss.development,
        {
          test: /font\.(woff|woff2|eot|ttf|otf|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[ext]'
          }
        },
        loaders.images
      ]
    },

    plugins: [
      ...configBase.plugins,

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


      new ESLintPlugin({
        cache: true,
        cacheLocation: path.resolve(paths.appNodeModules, '.cache/.eslintcache'),
        quiet: false,
        emitWarning: true,
        extensions: ['js', 'jsx', 'ts', 'tsx', 'mjs'],
        baseConfig: {
          extends: 'availity/workflow'
        }
      })
    ]
  };

  if (fs.existsSync(paths.appStatic)) {
    overrides.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            context: paths.appStatic, // copy from this directory
            from: '**/*', // copy all files
            to: 'static', // copy into {output}/static folder
            noErrorOnMissing: false
          }
        ]
      })
    );
  }

  overrides.plugins.push(new ReactRefreshWebpackPlugin());

  if (settings.isNotifications()) {
    overrides.plugins.push(
      new WebpackNotifierPlugin({
        contentImage: path.join(__dirname, './public/availity.png'),
        excludeWarnings: true
      })
    );
  }

  // TODO: set up persistent cache options https://webpack.js.org/guides/build-performance/#persistent-cache
  return _merge({}, configBase, overrides);

};
