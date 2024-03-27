import path from 'node:path';
import fs from 'node:fs';
import chalk from 'chalk';
import delay from 'delay';

import config from '../config';

import logger from '../logger';

const result = {
  cache: {},

  sendFile(req, res, status, response, filePath) {
    res.status(status).sendFile(filePath, (err) => {
      if (err) {
        logger.getInstance().error(`NOT FOUND ${filePath} `);

        res.sendStatus(404);
      } else {
        const file = chalk.blue(filePath);
        const relativeFile = path.relative(process.cwd(), file);

        // Attach file path to response object for logging at the end of request cycle
        res.avFile = relativeFile;
      }
    });
  },

  parseJSON(contents) {
    let replacedContents;
    try {
      replacedContents = JSON.parse(contents);
    } catch {
      replacedContents = contents;
    }

    return replacedContents;
  },

  sendJson(req, res, status, response, filePath) {
    try {
      const contents = fs.readFileSync(filePath, 'utf8');
      const regex = /\${context}/g;
      const replacedContents = contents.replace(regex, config.options.pluginContext);
      const json = this.parseJSON(replacedContents);

      const relativeFile = path.relative(process.cwd(), filePath);
      // Attach file path to response object for logging at the end of request cycle
      res.avFile = relativeFile;

      res.status(status).json(json);
    } catch {
      logger.getInstance().error(`NOT FOUND ${filePath} `);
      res.sendStatus(404);
    }
  },

  file(req, res, response, dataPath) {
    /* eslint-disable promise/catch-or-return */
    delay(response.latency || 200).then(() => {
      const filePath = path.join(dataPath, response.file);
      const status = response.status || 200;

      const headers = response.responseHeaders || {};
      for (const key of Object.keys(headers)) {
        res.set(key, response.responseHeaders[key]);
      }

      /* eslint-disable promise/always-return */
      if (path.extname(filePath) === '.json') {
        this.sendJson(req, res, status, response, filePath);
      } else if (path.extname(filePath) === '.js') {
        this.sendFunction(req, res, status, response, filePath);
      } else {
        this.sendFile(req, res, status, response, filePath);
      }
    });
  },

  noContent(req, res, response) {
    if (response.responseHeaders) {
      res.set(response.responseHeaders);
    }

    res.status(response.status).send();
  },

  url(req, res, response) {
    res.redirect(response.url);
  },

  send(req, res) {
    const { route, request } = res.locals;

    const routeId = route.id;
    const requestId = request.id;

    // cache: {
    //  'route1_request2': [0,0] //  position 0 === response index; position 1 === repeat index
    // }
    const cacheKey = `${routeId}_${requestId}`;

    let indexes = result.cache[cacheKey];

    if (!indexes) {
      // empty cache so hydrate
      indexes = [0, 0];
      result.cache[cacheKey] = [0, 0];
    }

    let responseIndex = indexes[0];
    let repeatIndex = indexes[1];

    let response = request.responses[responseIndex];

    if (repeatIndex >= response.repeat) {
      responseIndex = (responseIndex + 1) % request.responses.length;
      repeatIndex = 0;
    }

    repeatIndex += 1;

    // cache the latest index for the next request
    indexes[0] = responseIndex;
    indexes[1] = repeatIndex;
    result.cache[cacheKey] = indexes;

    // return the appropriate response object
    response = request.responses[responseIndex];

    if (response.file) {
      this.file(req, res, response, route.dataPath);
      return;
    }

    if (response.status && !response.file && !response.url) {
      this.noContent(req, res, response);
      return;
    }

    if (response.url) {
      this.url(req, res, response);
      return;
    }

    res.sendStatus(404);
  }
};

export default result;
