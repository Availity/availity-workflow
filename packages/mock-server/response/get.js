import match from './match.js';
import result from './result.js';

const get = {
  send(req, res) {
    match.set(req, res);
    result.send(req, res);
  }
};

export default get;
