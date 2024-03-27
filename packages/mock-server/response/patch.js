import match from './match';
import result from './result';

const patch = {
  tus(req, res) {
    if (req.is('application/offset+octet-stream') && req.headers['tus-resumable']) {
      res.set('upload-offset', req.headers['content-length']);
    }
  },

  send(req, res) {
    try {
      patch.tus(req, res);
      match.set(req, res);
      result.send(req, res);
    } catch {
      res.status(500).send({ error: 'mock server error' });
    }
  }
};

export default patch;
