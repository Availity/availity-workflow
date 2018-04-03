const config = require('../config');

module.exports = function requestHandler() {
  return (req, res, next) => {
    config.events.emit(config.constants.EVENTS.REQUEST, {
      req
    });

    next();
  };
};
