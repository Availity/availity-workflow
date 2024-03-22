
import DuplicatePackageCheckerPlugin  from 'duplicate-package-checker-webpack-plugin';
import { BundleAnalyzerPlugin }  from 'webpack-bundle-analyzer';
import _merge from 'lodash/merge';
import buildProdConfig from './webpack.config.production';

process.noDeprecation = true;

// Override user's potential browserslist config to ensure portal support here
// This is needed in addition to config.target below so that browserslist queries inside
// react-app-polyfill/stable and core-js provide everything needed
process.env.BROWSERSLIST = 'defaults';

const plugin = (settings) => {

  // const baseConfig = buildBaseConfig(settings)
  const baseProdConfig = buildProdConfig(settings)

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
      }),
    ]
  };

  return _merge({}, baseProdConfig, overrides)
};

export default plugin;
