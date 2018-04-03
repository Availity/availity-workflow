/* eslint no-console:0 */
const chalk = require('chalk');

let loggerInstance;

class DefaultLogger {
  constructor(options) {
    this.options = options;
  }

  warn(entry) {
    this.record(entry, 'yellow');
  }

  error(entry) {
    this.record(entry, 'red');
  }

  info(entry) {
    this.record(entry);
  }

  debug(entry) {
    this.record(entry);
  }

  log(entry) {
    this.record(entry);
  }

  // › Starting server
  record(entry, color) {
    const defaultColor = entry instanceof Error ? 'red' : 'gray';
    const crayoloa = color || defaultColor;

    console.log(`${chalk[crayoloa](entry)}`);
  }
}

class Logger {
  constructor() {
    this.provider = null;
    this.setProvider(() => new DefaultLogger());
  }

  canLog() {
    return process.env.NODE_ENV !== 'testing';
  }

  setProvider(fn) {
    if (fn) {
      this.provider = fn();
    }
  }

  warn(entry) {
    if (this.canLog()) {
      this.provider.warn(entry);
    }
  }

  error(entry) {
    if (this.canLog()) {
      this.provider.error(entry);
    }
  }

  info(entry) {
    if (this.canLog()) {
      this.provider.info(entry);
    }
  }

  debug(entry) {
    if (this.canLog()) {
      this.provider.debug(entry);
    }
  }

  log(entry) {
    if (this.canLog()) {
      this.provider.log(entry);
    }
  }
}

module.exports = {
  // singleton
  getInstance() {
    if (!loggerInstance) {
      loggerInstance = new Logger();
    }

    return loggerInstance;
  },

};
