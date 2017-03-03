const Promise = require('bluebird');
const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const ora = require('ora');
const chalk = require('chalk');
const Logger = require('availity-workflow-logger');
const sizeTree = require('webpack-bundle-size-analyzer/build/src/size_tree');
const argv = require('yargs').argv;

const plugin = require('./plugin');

function bundle(config) {

  return new Promise( (resolve, reject) => {

    // Check arguement or CLI arg or default to false
    const shouldProfile = (config && config.profile) || argv.profile || false;

    const webpackConfig = shouldProfile ? plugin('webpack.config.profile') : plugin('webpack.config.production');

    Logger.info('Started compiling');
    const spinner = ora('Running webpack');
    spinner.color = 'yellow';
    spinner.start();

    let previousPercent;

    webpackConfig.plugins.push(new ProgressPlugin( (percentage, msg) => {

      const percent = Math.round(percentage * 100);

      if (previousPercent === percent) {
        return;
      }
      previousPercent = percent;

      if (percent % 10 === 0 && msg !== null && msg !== undefined && msg.trim() !== '') {
        spinner.text = `Webpack ${percent}%`;
      }

    }));

    webpack(webpackConfig).run((err, stats) => {

      spinner.stop();

      if (err) {
        Logger.failed('Failed compiling');
        reject(err);
        return;
      }

      const statistics = stats.toString({
        colors: true,
        cached: true,
        reasons: false,
        source: false,
        chunks: false,
        children: false,
        errorDetails: shouldProfile,
        warnings: shouldProfile
      });

      if (shouldProfile) {
        Logger.info(`${chalk.dim('Webpack profile:')}
`);
        const statz = JSON.stringify(stats.toJson());
        const parsedStats = JSON.parse(statz);
        const trees = sizeTree.dependencySizeTree(parsedStats);
        trees.forEach(tree => {
          sizeTree.printDependencySizeTree(tree, true, 2, (output) => { Logger.simple(output) });
        });
        Logger.empty();
      }

      Logger.info(`${chalk.dim('Webpack stats:')}

${statistics}
`);
      Logger.success('Finished compiling');
      resolve();

    });

  });

}

module.exports = bundle;
