const path = require('path');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');

// TODO: add more complex workflow features for building/testing
module.exports = (config) => {
  config.development.open = '/';

  config.development.hotLoader = true;

  config.development.stats = {
    level: 'normal',
  };

  config.development.infrastructureLogging = {
    level: 'info',
  };

  config.ekko.enabled = false;

  // specify how to resolve node_modules since yarn hoists them to top-level
  config.modifyWebpackConfig = (webpackConfig, settings) => {
    if (!settings.__UNSAFE_EXPERIMENTAL_USE_RSPACK_DEV()) {
      webpackConfig.resolveLoader.modules.push(path.join(settings.project(), '../node_modules'));
      webpackConfig.resolve.plugins = [new TsConfigPathsPlugin()];
      if (settings.isProduction() || settings.isDryRun()) {
        // delete babel-loader rules
        webpackConfig.module.rules[0].oneOf.splice(1, 2);
        // use unshift to add rules, since they need to be placed _before_ the catch-all file loader
        webpackConfig.module.rules[0].oneOf.unshift(
          {
            test: /\.tsx?$/,
            include: settings.include(),
            use: [
              {
                loader: 'esbuild-loader',
                options: {
                  loader: 'tsx',
                  target: 'es2015',
                },
              },
            ],
          },
          {
            test: /\.js|jsx|mjs?$/,
            include: settings.include(),
            exclude: [new RegExp(`node_modules[/\\\\](?=(@av/av-joi)).*`)],
            use: [
              {
                loader: 'esbuild-loader',
                options: {
                  loader: 'jsx',
                  target: 'es2015',
                },
              },
            ],
          },
          // Process any JS outside of the app with esbuild.
          // Unlike the application JS, we only compile the standard ES features.
          {
            test: /\.(js|mjs)$/,
            exclude: settings.include(),
            loader: 'esbuild-loader',
            options: {
              loader: 'js',
              target: 'es2015',
            },
          }
        );
      } else {
        webpackConfig.module.rules.splice(1, 1);
        // add esbuild-loader for ts and tsx files
        webpackConfig.module.rules.push(
          {
            test: /\.tsx?$/,
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              target: 'es2015',
            },
          },
          {
            test: /\.js|jsx|mjs?$/,
            include: settings.include(),
            exclude: [new RegExp(`node_modules[/\\\\](?=(@av/av-joi)).*`)],
            use: [
              {
                loader: 'esbuild-loader',
                options: {
                  loader: 'jsx',
                  target: 'es2015',
                },
              },
            ],
          }
        );
      }
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );
    }
    webpackConfig.resolve.fallback = Object.assign(webpackConfig.resolve.fallback, { url: false, buffer: false });
  };

  return config;
};
