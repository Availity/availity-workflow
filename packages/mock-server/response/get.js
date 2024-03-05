import match from './match';
import result from './result';

export default get = {
  send(req, res) {
    match.set(req, res);
    result.send(req, res);
  }
};
