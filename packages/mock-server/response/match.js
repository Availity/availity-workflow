/* eslint-disable unicorn/no-this-assignment */

function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

const match = {
  scoreHeaders(score, _request, headers) {
    // Note: variables prefixed with "_" underscore signify config object|key|value

    const reqHeaders = _request.headers;

    if (!reqHeaders) return score;

    for (const [_headerKey, _headerValue] of Object.entries(reqHeaders)) {
      const headerValue = headers[_headerKey];

      if (_headerValue === headerValue) {
        score.hits += 1; // values are equal
      } else if (!headerValue) {
        score.misses -= 1;
      } else {
        score.valid = false;
      }
    }

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

    const paramValue = __paramValue == null ? [] : Array.from(__paramValue);

    const hits = _paramValue.filter(x => paramValue.includes(x));
    score.hits += hits.length;

    const misses = _paramValue.filter(x => !paramValue.includes(x));
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

    if (!reqParams) return score;

    for (const [key, value] of Object.entries(reqParams)) {
      const paramValue = method === 'get' ? params[key] : getByPath(params, key);

      if (Array.isArray(value)) {
        self.scoreArray(score, value, paramValue);
      } else if (typeof value === 'object' && value !== null && value.pattern) {
        self.scorePattern(score, value, paramValue);
      } else {
        self.scoreParam(score, value, paramValue);
      }
    }

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

    const params = Object.keys(req.query).length === 0 ? req.body : req.query;
    // const headers = req.headers;

    const topScore = {
      hits: 0,
      misses: 0
    };

    // set the default request
    [res.locals.request] = requests;

    for (const _request of requests) {
      const score = self.scoreParams(_request, params, method);
      self.scoreHeaders(score, _request, req.headers);

      if (!score.valid) {
        continue;
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
    }
  }
};

export default match;
