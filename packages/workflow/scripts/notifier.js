import updateNotifier from 'update-notifier';
import chalk from 'chalk';
import Logger from '@availity/workflow-logger';
import pkg from '../package.json' with { type: "json" };

const options = {
  pkg,
  callback(err, update) {
    if (!update) {
      return;
    }

    if (update.type !== 'latest') {
      const message = chalk.bold.black('UPDATE AVAILABLE');
      Logger.warn(
        `${chalk.bold.bgYellow(message)} ${chalk.bold.green(update.latest)} (current: ${
          update.current
        }). Run ${chalk.blue('npm install @availity/workflow@latest -D')}.`
      );
    }
  }
};

export default function notifier() {
  return new updateNotifier.UpdateNotifier(options);
};
