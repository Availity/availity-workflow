const _ = require('lodash');
const Promise = require('bluebird');
const webpack = require('webpack');
const chalk = require('chalk');

const Logger = require('availity-workflow-logger');
const settings = require('availity-workflow-settings-2');
const utils = require('./utils');
const progressOutput = utils.progressOutput;
const logErrors = utils.logErrors;

// get proxy values
const defaultProxy = {
  changeOrigin: true,
  ws: true,
  logLevel: 'info',
  logProvider() {
    return {
      log() {
        Logger.log(message(arguments));
      },
      debug() {
        Logger.debug(message(arguments));
      },
      info() {
        Logger.info(message(arguments));
      },
      warn() {
        Logger.warn(message(arguments));
      },
      error() {
        Logger.error(message(arguments));
      }
    };
  }
};

module.exports = (ekkoTarget) => {
  const useSettings = settings();
  let hasReturned = false;
  return new Promise((resolve, reject) => {
    const webpackConfig = _.isFunction(useSettings.webpack) ? useSettings.webpack() : useSettings.webpack;
    progressOutput.addPlugin(webpackConfig);
    progressOutput.setEnabled(false);

    const compiler = webpack(webpackConfig);
    compiler.plugin('invalid', () => {
      progressOutput.start();
    });

    compiler.plugin('done', stats => {
      progressOutput.stop();
      const hasErrors = stats.hasErrors();
      const hasWarnings = stats.hasWarnings();
      if (!hasErrors && !hasWarnings) {
        const webpackLog = _.get(useSettings, 'options.webpackLog');
        if (webpackLog) {
          const statistics = stats.toString(webpackLog)
          Logger.info(`${chalk.dim('Webpack stats: ')}\n${statistics}`);
        }
        Logger.success(`${chalk.gray('Compiled')} in ${chalk.magenta(pretty(statistics.time))}`);

        if (!hasReturned) {
          resolve();
          hasReturned = true;
        }
      }
      if (hasErrors) {
        const json = stats.toJson({
          assets: false,
          colors: true,
          version: false,
          hash: false,
          timings: false,
          chunks: false,
          chunkModules: false,
          errorDetails: false
        });
        logErrors(json.errors);
      }
    });

    const webpackOptions = {
      contentBase: _.get(useSettings, 'options.output'),
      // display no info to console (only warnings and errors)
      noInfo: true,
      // display nothing to the console
      quiet: true,
      historyApiFallback: _.get(useSettings, 'options.historyFallback', true),
      compress: true,
      hot: true,
      // Reportedly, this avoids CPU overload on some systems.
      // https://github.com/facebookincubator/create-react-app/issues/293
      watchOptions: {
        ignored: /node_modules/
      }
    };

    let proxies = _.map(_.get(useSettings, 'proxies', []), proxy => {
      const newProxy = _.merge({}, defaultProxy, proxy);
      let needsEkko = false;
      if (newProxy.target === 'EKKO' || (newProxy.useEkko && !newProxy.target)) {
        newProxy.target = ekkoTarget;
        needsEkko = true;
      }
      if (newProxy.router) {
        _.forEach(newProxy.router, (val) => {
          if (val === 'EKKO') {
            val = ekkoTarget;
            needsEkko = true;
          }
        });
      }
      if (!proxyConfig.enabled) {
        Logger.info(`Proxy with context: ${chalk.dim(proxyConfig.context)} and target: ${chalk.dim(proxyConfig.target)} is ${chalk.magenta('DISABLED')}`);
        return false;
      }
      if (needsEkko && !ekkoTarget) {
        Logger.info(`Proxy with context: ${chalk.dim(proxyConfig.context)} is ${chalk.magenta('DISABLED')} without ekko used`);
        return false;
      }
      return newProxy;
    });
    proxies = _.compact(proxies);
    if (proxies.length > 0) {
      webpackOptions.proxy = proxies;
    }

    progressOutput.start();
    server = new WebpackDevSever(compiler, webpackOptions);
    server.listen(useSettings.options.port, (err) => {
      if (err) {
        Logger.failed(err);
        reject(err);
      }
      Logger.info('Started development server');
      progressOutput.setEnabled(true);
    });
  });
}
