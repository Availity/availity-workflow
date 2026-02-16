import fs from 'fs';
import webpack from 'webpack';
import ProgressPlugin from 'webpack/lib/ProgressPlugin.js';
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
    fs.rmSync(settings.output(), { recursive: true, force: true });
  }

  // Lazy load this else yargs loads too early https://github.com/Availity/@availity/workflow/issues/133
  const { default: yargs } = await import('yargs');
  const { argv } = yargs(process.argv.slice(2));

  // Check argument or CLI arg or default to false
  const shouldProfile = profile || argv.profile || false;

  let webpackConfig;
  try {
    webpackConfig = shouldProfile ? webpackConfigProfile(settings) : webpackConfigProduction(settings);
  } catch (error) {
    Logger.error(`There was an error creating the Webpack config: ${error.message}`);
    throw error.message;
  }

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
  return new Promise((resolve, reject) => {
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

async function bundleVite({ settings }) {
  const { build } = await import('vite');
  const { default: buildViteProductionConfig } = await import('../vite.config.production.js');

  if (!settings.isDryRun()) {
    Logger.success(`Cleaning directories ${settings.output()}`);
    fs.rmSync(settings.output(), { recursive: true, force: true });
  }

  let viteConfig = buildViteProductionConfig(settings);

  const { modifyViteConfig } = settings.config();
  if (typeof modifyViteConfig === 'function') {
    viteConfig = modifyViteConfig(viteConfig, settings) || viteConfig;
  }

  Logger.info('Started compiling with Vite');
  const spinner = ora('Running Vite build');
  spinner.color = 'yellow';
  spinner.start();

  try {
    await build(viteConfig);
    spinner.stop();
    Logger.success('Finished compiling with Vite');
  } catch (error) {
    spinner.stop();
    Logger.failed('Failed to build with Vite');
    throw error;
  }
}

function bundle({ profile, settings }) {
  if (settings.isVite()) {
    return bundleVite({ settings });
  }
  return bundleWebpack({ profile, settings });
}

export default bundle;
