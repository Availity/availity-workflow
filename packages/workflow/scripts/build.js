import fs from 'node:fs';
import webpack from 'webpack';
import ora from 'ora';
import chalk from 'chalk';
import Logger from '@availity/workflow-logger';
import sizeTree from 'webpack-bundle-size-analyzer/build/src/size_tree.js';

import webpackConfigProfile from '../webpack.config.profile.js';
import webpackConfigProduction from '../webpack.config.production.js';
import customStats from './stats.js';

async function bundleWebpack({ profile, settings }) {
  if (!settings.isDryRun()) {
    Logger.success(`Cleaning directories ${settings.output()}`);
    await fs.promises.rm(settings.output(), { recursive: true, force: true });
  }

  const shouldProfile = profile || settings.isProfile();

  let webpackConfig;
  try {
    webpackConfig = shouldProfile ? webpackConfigProfile(settings) : webpackConfigProduction(settings);
  } catch (error) {
    Logger.error(`There was an error creating the Webpack config: ${error.message}`);
    throw error;
  }

  Logger.info('Started compiling');
  const spinner = ora('Running webpack');
  spinner.color = 'yellow';
  spinner.start();

  const { modifyWebpackConfig } = settings.config();

  if (typeof modifyWebpackConfig === 'function') {
    webpackConfig = modifyWebpackConfig(webpackConfig, settings) || webpackConfig;
  }

  return new Promise((resolve, reject) => {
    let previousPercent;

    webpackConfig.plugins.push(
      new webpack.ProgressPlugin((percentage, msg) => {
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

    webpack(webpackConfig).run((err, stats) => {
      spinner.stop();

      if (err) {
        Logger.failed('Failed to run, possible webpack configuration error');
        reject(err);
        return;
      }

      const statistics = customStats(stats, {
        errorDetails: stats.hasErrors(),
        warnings: stats.hasWarnings(),
      });

      if (stats.hasErrors()) {
        Logger.failed('Compilation finished with errors');
        Logger.info(`${chalk.dim('Webpack stats:')}\n\n${statistics}\n`);
        reject(new Error('Webpack compilation failed'));
        return;
      }

      if (shouldProfile) {
        Logger.info(`${chalk.dim('Webpack profile:')}\n`);
        const parsedStats = stats.toJson();
        const trees = sizeTree.dependencySizeTree(parsedStats);
        for (const tree of trees) {
          sizeTree.printDependencySizeTree(tree, true, 2, (output) => {
            Logger.simple(output);
          });
        }
        Logger.empty();
      }

      Logger.info(`${chalk.dim('Webpack stats:')}\n\n${statistics}\n`);
      Logger.success('Finished compiling');
      resolve();
    });
  });
}

export default bundleWebpack;
