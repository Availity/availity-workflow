const del = require('del');
const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const ora = require('ora');
const chalk = require('chalk');
const Logger = require('@availity/workflow-logger');
const sizeTree = require('webpack-bundle-size-analyzer/build/src/size_tree');

const webpackConfigProfile = require('../webpack.config.profile');
const webpackConfigProduction = require('../webpack.config.production');
const customStats = require('./stats');

function bundleWebpack({ profile, settings }) {
  return new Promise((resolve, reject) => {
    if (!settings.isDryRun()) {
      Logger.success(`Cleaning directories ${settings.output()}`);
      del.sync([settings.output()]);
    }

    // Lazy load this else yargs loads too early https://github.com/Availity/@availity/workflow/issues/133
    const { argv } = require('yargs');

    // Check argument or CLI arg or default to false
    const shouldProfile = profile || argv.profile || false;

    let webpackConfig;
    try {
      webpackConfig = shouldProfile ? webpackConfigProfile(settings) : webpackConfigProduction(settings);
    } catch (error) {
      Logger.error(`There was an error creating the Webpack config: ${error.message}`);
      reject(error.message);
      return;
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
  const { build } = require('vite');
  const buildViteProductionConfig = require('../vite.config.production');

  if (!settings.isDryRun()) {
    Logger.success(`Cleaning directories ${settings.output()}`);
    del.sync([settings.output()]);
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

module.exports = bundle;
