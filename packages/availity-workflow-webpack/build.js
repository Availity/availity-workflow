const _ = require('lodash');
const Promise = require('bluebird');
const webpack = require('webpack');
const chalk = require('chalk');
const sizeTree = require('webpack-bundle-size-analyzer/build/src/size_tree');

const Logger = require('availity-workflow-logger');
const settings = require('availity-workflow-settings-2');
const progressOutput = require('./utils').progressOutput;

function build() {
  const useSettings = settings();
  const webpackConfig = _.isFunction(useSettings.webpack) ? useSettings.webpack() : useSettings.webpack;
  const profile = useSettings.options.profile || useSettings.argv.profile;

  progressOutput.addPlugin(webpackConfig);
  progressOutput.start();

  return new Promise( (resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      progressOutput.stop();
      if (err) {
        Logger.failed('Failed compiling');
        reject(err);
        return;
      }
      if (profile) {
        Logger.info(`${chalk.dim('Webpack profile:')}`);
        const trees = sizeTree.dependencySizeTree(stats.toJson());
        trees.forEach(tree => {
          sizeTree.printDependencySizeTree(tree, true, 2, (output) => {
            Logger.simple(output)
          });
        });
        Logger.empty();
      }
      const statistics = stats.toString({
        colors: true,
        cached: true,
        reasons: false,
        source: false,
        chunks: false,
        children: false,
        errorDetails: profile,
        warnings: profile
      });
      Logger.info(`${chalk.dim('Webpack stats: ')}\n${statistics}`);
      Logger.success('Finished compiling');
      resolve();
    });
  });
}


module.exports = build;
