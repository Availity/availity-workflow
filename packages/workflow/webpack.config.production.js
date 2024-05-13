const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const fs = require('fs');
const merge = require('lodash/merge');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const paths = require('./helpers/paths');

const loaders = require('./loaders');
const conf = require('./webpack.config');

const { buildBaseConfig } = conf;

process.noDeprecation = true;

// Override user's potential browserslist config to ensure portal support here
// This is needed in addition to config.target below so that browserslist queries inside
// react-app-polyfill/stable and core-js provide everything needed
process.env.BROWSERSLIST = 'defaults';

const plugin = (settings) => {
  const baseConfig = buildBaseConfig(settings);

  const overrides = {
    mode: 'production',

    // Using an explicit browserslist query will override any project configs
    // This is fine because we need to ensure our targets in the portal
    target: 'browserslist: defaults',

    optimization: {
      splitChunks: {
        cacheGroups: {
          // https://webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks
          // Add defaultVendors and default so we don't override webpack 5 defaults
          // When files paths are processed by webpack, they always contain / on Unix systems and \ on Windows.
          // That's why using [\\/] in {cacheGroup}.test fields is necessary to represent a path separator.
          // / or \ in { cacheGroup }.test will cause issues when used cross- platform.
          defaultVendors: {
            test: /[/\\]node_modules[/\\]/,
            idHint: 'defaultVendors',
            chunks: 'all',
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          },
          // Create a chunk for react and react-dom since they shouldn't change often
          // https://webpack.js.org/guides/caching/#extracting-boilerplate
          // https://webpack.js.org/plugins/split-chunks-plugin/#split-chunks-example-3
          react: {
            test: /[/\\]node_modules[/\\](react|react-dom)[/\\]/,
            idHint: 'vendors',
            chunks: 'all',
            priority: 10
          },
          // Create a chunk for lodash or any of its separate packages
          lodash: {
            // Should capture lodash/, lodash-es/, lodash.whateverModule/
            test: /[/\\]node_modules[/\\](lodash([.-])?\w*?)[/\\]/,
            idHint: 'vendors',
            chunks: 'all',
            priority: 1
          },
          moment: {
            test: /[/\\]node_modules[/\\](moment)[/\\]/,
            idHint: 'vendors',
            chunks: 'all',
            priority: 2
          },
          styles: {
            idHint: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          }
          // TODO: Add cacheGroup for Availity packages in node_modules ?
        }
      },
      minimizer: [],

      // To extract boilerplate like runtime and manifest info
      // Should aid caching by keeping filenames consistent if content doesn't change
      runtimeChunk: 'single',

      // Keeps vendor hashes consistent between builds where local dependency imports change the order of resolution
      // https://webpack.js.org/guides/caching/#module-identifiers
      // https://webpack.js.org/configuration/optimization/#optimizationmoduleids
      moduleIds: 'deterministic'
    },

    output: {
      ...baseConfig.output,
      devtoolModuleFilenameTemplate: (info) =>
        `webpack:///${path.relative(settings.project(), info.absoluteResourcePath)}${
          info.loaders ? `?${info.loaders}` : ''
        }`
    },

    module: {
      rules: [
        // "oneOf" will traverse all the following loaders until it finds a match.
        // If no loader matches it will use the default file loader at the end of this list.
        {
          oneOf: [
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
              test: /\.(js|jsx|ts|tsx)$/,
              include: settings.include(),
              use: [
                {
                  loader: 'esbuild-loader',
                  options: {
                    loader: 'tsx',
                    target: 'es2015'
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
            {
              test: /font\.(woff|woff2|eot|ttf|otf|svg)$/i,
              type: 'asset/resource',
              generator: {
                filename: 'fonts/[name][ext]'
              }
            },
            loaders.images,
            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            // This loader doesn't use a "test" so it will catch all modules
            // that fall through the other loaders.
            {
              type: 'asset/resource',
              // Exclude `js` files to keep "css" loader working as it injects
              // its runtime that would otherwise be processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpack's internal loaders.
              exclude: [/\.(js|cjs|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              generator: {
                filename: 'static/media/[contenthash:8][ext]'
              }
            }
          ]
        }
      ]
    },
    plugins: [
      ...baseConfig.plugins,
      new loaders.MiniCssExtractPlugin({
        filename: 'css/[name]-[contenthash:8].chunk.css'
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

  if (settings.isProduction() && !settings.shouldMimicStaging) {
    overrides.optimization.minimizer.push(
      new TerserPlugin({
        terserOptions: {
          parse: {
            // We want terser to parse ecma 8 code. However, we don't want it
            // to apply any minification steps that turns valid ecma 5 code
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
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending further investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2
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
      new CssMinimizerPlugin()
    );
  }

  const config = merge({}, baseConfig, overrides);

  return config;
};

module.exports = plugin;
