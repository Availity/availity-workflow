import match from './match';
import result from './result';

const get = {
  send(req, res) {
    match.set(req, res);
    result.send(req, res);
  }
};

export default get;
