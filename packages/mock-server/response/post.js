import _ from 'lodash';

import match from './match';
import result from './result';

const logger = import('../logger').then(getInstance());

export default post = {
  multipart(req) {
    /* eslint-disable promise/avoid-new */
    return new Promise((resolve, reject) => {
      if (!req.is('multipart')) {
        resolve(true);
        return;
      }

      req.busboy.on('file', (fieldname, file, fileParams) => {
        file.on('error', (error) => {
          logger.error('Something went wrong uploading the file', error);
        });
        file.on('end', () => {
          // Treat the file name as a field so we can match and score
          logger.info('File finished %s:', fileParams.filename);
          req.body[fieldname] = fileParams.filename;
        });
        // `file` is a `ReadableStream`...always do something with it
        // else busboy won't fire the 'finish' even.  At minimum do:
        file.resume();
      });

      req.busboy.on('field', (key, value) => {
        if (_.isEmpty(value)) {
          return;
        }

        logger.info(`${key}, ${value}`);

        req.body[key] = value;
      });

      req.busboy.on('error', (err) => {
        logger.error(err);
        reject(err);
      });

      req.busboy.on('close', () => {
        logger.info('finished request');
        resolve(true);
      });

      req.pipe(req.busboy);
    });
  },

  send(req, res) {
    return post.multipart(req).then(
      () => {
        match.set(req, res);
        result.send(req, res);
        return null;
      },
      () => {
        res.status(500).send({ error: 'mock server error' });
      }
    );
  }
};
