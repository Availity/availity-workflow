import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import deepMerge from './helpers/deep-merge.js';

import buildProdConfig from './webpack.config.production.js';

const plugin = (settings) => {
  process.noDeprecation = true;
  process.env.BROWSERSLIST = 'defaults';
  // const baseConfig = buildBaseConfig(settings)
  const baseProdConfig = buildProdConfig(settings);

  const overrides = {
    plugins: [
      ...baseProdConfig.plugins,

      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'profile.html'
      }),

      new DuplicatePackageCheckerPlugin({
        exclude(instance) {
          return instance.name === 'regenerator-runtime';
        }
      })
    ]
  };

  return deepMerge({}, baseProdConfig, overrides);
};

export default plugin;
