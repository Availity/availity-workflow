import del from 'del';
import webpack from 'webpack';
import ProgressPlugin from 'webpack/lib/ProgressPlugin';
import ora from 'ora';
import chalk from 'chalk';
import Logger from '@availity/workflow-logger';
import sizeTree from 'webpack-bundle-size-analyzer/build/src/size_tree';

import webpackConfigProfile from '../webpack.config.profile';
import webpackConfigProduction from '../webpack.config.production';
import customStats from './stats';

export default function bundle({ profile, settings }) {
  return new Promise(async (resolve, reject) => {
    if (!settings.isDryRun()) {
      Logger.success(`Cleaning directories ${settings.output()}`);
      del.sync([settings.output()]);
    }

    // Lazy load this else yargs loads too early https://github.com/Availity/@availity/workflow/issues/133
    // eslint-disable-next-line global-require
    const { argv } = await import('yargs');

    // Check argument or CLI arg or default to false
    const shouldProfile = profile || argv.profile || false;

    let webpackConfig = shouldProfile ? webpackConfigProfile(settings) : webpackConfigProduction(settings);

    Logger.info('Started compiling');
    const spinner = ora('Running webpack');
    spinner.color = 'yellow';
    spinner.start();

    let previousPercent;

    webpackConfig.plugins.push(
      new ProgressPlugin((percentage, msg) => {
        const percent = Math.round(percentage * 100);

        if (previousPercent === percent) {
          return;
        }
        previousPercent = percent;

        if (percent % 10 === 0 && msg !== null && msg !== undefined && msg.trim() !== '') {
          spinner.text = `Webpack ${percent}%`;
        }
      })
    );

    const { modifyWebpackConfig } = settings.config();

    if (typeof modifyWebpackConfig === 'function') {
      webpackConfig = modifyWebpackConfig(webpackConfig, settings) || webpackConfig;
    }

    // https://webpack.js.org/api/node/#webpack
    webpack(webpackConfig).run((err, stats) => {
      spinner.stop();

      if (err) {
        Logger.failed('Failed to run, possible webpack configuration error');
        reject(err);
        return;
      }

      // https://webpack.js.org/api/node/#error-handling
      const statistics = customStats(stats, {
        errorDetails: stats.hasErrors(),
        warnings: stats.hasWarnings()
      });

      if (shouldProfile) {
        Logger.info(`${chalk.dim('Webpack profile:')}
`);
        const statz = JSON.stringify(stats.toJson());
        const parsedStats = JSON.parse(statz);
        const trees = sizeTree.dependencySizeTree(parsedStats);
        for (const tree of trees) {
          sizeTree.printDependencySizeTree(tree, true, 2, (output) => {
            Logger.simple(output);
          });
        }
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
