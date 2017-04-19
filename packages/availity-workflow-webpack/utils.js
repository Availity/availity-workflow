const _ = requier('lodash');
const ora = require('ora');
const settings = require('availity-workflow-settings-2');
const Logger = require('availity-workflow-logger');

let previousPercent;
const spinner = ora({
  color: 'yellow'
});
let isRunning = false;
let enabled = true;

const progressOutput = {
  addPlugin(config) {
    config.plugins.push(new ProgressPlugin( (percentage, msg) => {
      const percent = Math.round(percentage * 100);

      if (previousPercent !== percent && percent % 10 === 0 && msg !== null && msg !== undefined && msg.trim() !== '') {
        spinner.text = `Webpack ${percent}% ${msg}`;
        previousPercent = percent;
      }
    }));
  },
  setEnabled(val = true) {
    // check if setEnabled is different then current value
    if (!!val !== enabled) {
      enabled = !!val;
      // if spinner should be running, either start are stop it depending on enabled
      if (isRunning) {
        enabled ? spinner.start() : spinner.stop();
      }
    }
  }
  start() {
    Logger.info('Started compiling');
    spinner.text = 'Running webpack';
    if (enabled) {
      spinner.start();
    }
    isRunning = true;
  },
  stop() {
    if (enabled) {
      spinner.stop();
    }
    isRunning = false;
  }
}

const friendlySyntaxErrorLabel = 'Syntax error:';

function isLikelyASyntaxError(message) {
  return message.indexOf(friendlySyntaxErrorLabel) !== -1;
}

const replace = [
  ['Module build failed: SyntaxError:', friendlySyntaxErrorLabel],
  [/Module not found: Error: Cannot resolve 'file' or 'directory'/, 'Module not found:'],
  [/^\s*at\s((?!webpack:).)*:\d+:\d+[\s\)]*(\n|$)/gm, ''],
  ['./~/css-loader!./~/postcss-loader!', ''],
  [/\s@ multi .+/, '']
];

function formatMessage(message) {
  let formatted = replace.reduce((output, replace) => {
    return output.replace(...replace)
  }, message);
  return 'Error in ' + formatted;
}

function logErrors(errors) {
  if (!errors) {
    return;
  }
  let formattedErrors = errors.map(formatMessage);
  if (formattedErrors.some(isLikelyASyntaxError)) {
    formattedErrors = formattedErrors.filter(isLikelyASyntaxError);
  }
  formattedErrors.forEach(error => {
    Logger.empty();
    Logger.simple(`${chalk.red(error)}`);
    Logger.empty();
  });

  Logger.failed('Failed compiling');
  Logger.empty();
}

module.exports = {
  progressOutput,
  logErrors
};
