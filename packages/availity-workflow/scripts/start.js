const os = require('os');
const Logger = require('availity-workflow-logger');
const chalk = require('chalk');
const webpack = require('webpack');
const perfy = require('perfy');
const once = require('lodash.once');
const debounce = require('lodash.debounce');
const after = require('lodash.after');
const Ekko = require('availity-ekko');
const open = require('opn');
const Promise = require('bluebird');
const settings = require('availity-workflow-settings');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const WebpackDevSever = require('webpack-dev-server');

const proxy = require('./proxy');
const notifier = require('./notifier');

Promise.config({
  longStackTraces: true
});

const friendlySyntaxErrorLabel = 'Syntax error:';

function isLikelyASyntaxError(message) {
  return message.indexOf(friendlySyntaxErrorLabel) !== -1;
}

function formatMessage(message) {
  return message
    .replace(
      'Module build failed: SyntaxError:',
      friendlySyntaxErrorLabel
    )
    .replace(
      /Module not found: Error: Cannot resolve 'file' or 'directory'/,
      'Module not found:'
    )
    .replace(/^\s*at\s.*:\d+:\d+[\s\)]*\n/gm, '')
    .replace('./~/css-loader!./~/postcss-loader!', '');
}

function init() {

  settings.init();
  settings.log();

  return Promise.resolve(true);

}

function web() {

  return new Promise((resolve, reject) => {

    let webpackConfig;

    try {
      webpackConfig = require(`${settings.pkg().availityWorkflow.plugin}/webpack.config`);
    } catch (err) {
      // workaround when lerna linked modules
      const relative = require('require-relative');
      webpackConfig = relative(`${settings.pkg().availityWorkflow.plugin}/webpack.config`, settings.project());
    }

    webpackConfig.plugins.push(new ProgressPlugin( (percentage, msg) => {

      const percent = percentage * 100;

      if (percent % 20 === 0 && msg !== null && msg !== undefined && msg !== ''){
        Logger.info(`${chalk.dim('Webpack')} ${msg}`);
      }

    }));

    const compiler = webpack(webpackConfig);

    compiler.plugin('compile', () => {
      perfy.start('webpack-perf');
    });

    compiler.plugin('invalid', () => {
      Logger.info('Started compiling');
    });

    const openBrowser = once(() => open());

    const message = debounce(stats => {

      openBrowser();

      const statistics = stats.toString({
        colors: true,
        cached: true,
        reasons: false,
        source: false,
        chunks: false,
        children: false
      });

      const uri = `http://localhost:${settings.config().development.port}/`;

      let result = {
        time: 'N/A'
      };

      try {
        result = perfy.end('webpack-perf');
      } catch (err) {
        // no op
      }


      Logger.info(statistics);
      const time = `${result.time}s`;

      Logger.info(`Finished compiling in ${chalk.magenta(time)}`);
      Logger.box(`The app is running at ${chalk.green(uri)}`);

    }, 300);

    compiler.plugin('done', stats => {

      const hasErrors = stats.hasErrors();
      const hasWarnings = stats.hasWarnings();

      if (!hasErrors && !hasWarnings) {
        message(stats);
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

        let formattedErrors = json.errors.map(msg => {
          return 'Error in ' + formatMessage(msg);
        });

        if (formattedErrors.some(isLikelyASyntaxError)) {
          formattedErrors = formattedErrors.filter(isLikelyASyntaxError);
        }

        Logger.failed('Failed compiling');

        formattedErrors.forEach(error => {
          Logger.empty();
          Logger.simple(`${chalk.red(error)}`);
          Logger.empty();
        });

        reject('Failed compiling');
      }

    });

    const webpackOptions = {

      contentBase: settings.output(),
      // display no info to console (only warnings and errors)
      noInfo: true,
      // display nothing to the console
      quiet: true,

      historyApiFallback: settings.historyFallback(),

      compress: true,

      hot: true,

      // Reportedly, this avoids CPU overload on some systems.
      // https://github.com/facebookincubator/create-react-app/issues/293
      watchOptions: {
        ignored: /node_modules/
      }

    };

    const proxyConfig = proxy();

    if (proxyConfig) {
      webpackOptions.proxy = proxyConfig;
    }

    const server = new WebpackDevSever(compiler, webpackOptions);

    if (settings.isEkko()) {

      const ekkoOptions = {
        data: settings.config().ekko.data,
        routes: settings.config().ekko.routes,
        plugins: settings.config().ekko.plugins,
        pluginContext: settings.config().ekko.pluginContext
      };

      const ekko = new Ekko();

      server.use(ekko.middleware(ekkoOptions));

    }

    server.listen(settings.config().development.port, (err) => {

      if (err) {
        Logger.failed(err);
        reject(err);
      }

      Logger.info('Started development server');
      resolve();

    });

  });

}

function isMac() {
  return os.platform() === 'darwin';
}

function exit() {

  // Capture ^C
  process.once('SIGINT', () => {
    const command = isMac() ? '⌘ + C' : 'CTRL + C';
    Logger.empty();
    Logger.info(`Detected ${chalk.blue(command)} now exiting.`);

  });

}

function start() {

  return init()
    .then(web)
    .then(notifier)
    .then(exit)
    .catch(err => {
      Logger.error(err);
    });

}

module.exports = start;
