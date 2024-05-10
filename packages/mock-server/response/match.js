/* eslint-disable unicorn/no-this-assignment */
const difference = require('lodash/difference');
const each = require('lodash/each');
const get = require('lodash/get');
const intersection = require('lodash/intersection');
const isArray = require('lodash/isArray');
const isEmpty = require('lodash/isEmpty');
const isObject = require('lodash/isObject');
const toArray = require('lodash/toArray');

const match = {
  scoreHeaders(score, _request, headers) {
    // Note: variables prefixed with "_" underscore signify config object|key|value

    const reqHeaders = _request.headers;

    each(reqHeaders, (_headerValue, _headerKey) => {
      const headerValue = get(headers, _headerKey);

      if (_headerValue === headerValue) {
        score.hits += 1; // values are equal
      } else if (!headerValue) {
        score.misses -= 1;
      } else {
        score.valid = false;
      }
    });

    return score;
  },

  scoreParam(score, _paramValue, paramValue) {
    // Note: variables prefixed with "_" underscore signify config object|key|value

    if (_paramValue === paramValue) {
      score.hits += 1; // perfect match
    } else if (!paramValue) {
      score.misses += 1; // request config is looking for a param but actual request doesn't have it
    } else {
      score.valid = false; // request config {a:1} not match value of request params {a:10}
    }
  },

  scorePattern(score, _paramValue, paramValue) {
    // Note: variables prefixed with "_" underscore signify config object|key|value

    const regex = new RegExp(_paramValue.pattern, _paramValue.flags || 'i');

    if (regex.test(paramValue)) {
      score.hits += 1; // perfect match
    } else if (!paramValue) {
      score.misses += 1; // request config is looking for a param but actual request doesn't have it
    } else {
      score.valid = false; // request config {a:1} not match value of request params {a:10}
    }
  },

  scoreArray(score, _paramValue, __paramValue) {
    // Note: variables prefixed with "_" underscore signify config object|key|value

    const paramValue = toArray(__paramValue);

    const hits = intersection(_paramValue, paramValue);
    score.hits += hits.length;

    const misses = difference(_paramValue, paramValue);
    score.misses += misses.length;

    return score;
  },

  scoreParams(_request, params, method) {
    const self = this;

    // Note: variables prefixed with "_" underscore signify config object|key|value

    const score = {
      hits: 0, // Matching parameters
      misses: 0, // Parameters specified in route, but not present in query
      valid: true // False if a parameter is specified in route and query, but they are not equal and therefore should never match
    };

    const reqParams = _request.params;

    each(reqParams, (value, key) => {
      const paramValue = method === 'get' ? params[key] : get(params, key);

      if (isArray(value)) {
        self.scoreArray(score, value, paramValue);
      } else if (isObject(value) && value.pattern) {
        self.scorePattern(score, value, paramValue);
      } else {
        self.scoreParam(score, value, paramValue);
      }
    });

    return score;
  },

  /**
   * Sets the res.locals.request object that nearly matches to the http request object.
   *
   * @param {[type]} req http request object
   * @param {[type]} res http response object
   */
  set(req, res) {
    // Note: variables prefixed with "_" underscore signify config object object|key|value

    const self = this;

    const { route } = res.locals;
    const method = req.method.toLowerCase();
    const requests = route.methods[method];

    const params = isEmpty(req.query) ? req.body : req.query;
    // const headers = req.headers;

    const topScore = {
      hits: 0,
      misses: 0
    };

    // set the default request
    [res.locals.request] = requests;

    each(requests, (_request) => {
      const score = self.scoreParams(_request, params, method);
      self.scoreHeaders(score, _request, req.headers);

      if (!score.valid) {
        return;
      }

      // Top Score:
      //
      //  1. Top hits
      //  2. Unless top hits are equal the one with least amount of misses
      //  3. Unless both hits and misses are equal last configuration should win
      if (
        score.hits > topScore.hits ||
        (score.hits === topScore.hits && score.misses < topScore.misses) ||
        (score.hits === topScore.hits && score.misses === topScore.misses)
      ) {
        topScore.hits = score.hits;
        topScore.misses = score.misses;
        res.locals.request = _request;
      }
    });
  }
};

module.exports = match;
