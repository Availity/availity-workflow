const _ = requier('lodash');
const settings = require('availity-workflow-settings-2');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// default webpack config builder
module.exports = () => {
  const useSettings = settings();
  let webpackConfig = _.get(useSettings, [useSettings.env, 'webpack'], {});
  if (_.isFunction(webpackConfig)) {
    webpackConfig = webpackConfig();
  }
  // if profile is indicated, and useProfile isn't set to false in the options
  if ((useSettings.options.profile || useSettings.argv.profile) && (_.isUndefined(useSettings.options.useProfile) || useSettings.options.useProfile)) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'profile.html'
    }));
  }
  return webpackConfig;
}
