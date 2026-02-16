import match from '../../response/match.js';

const freshScore = () => ({ hits: 0, misses: 0, valid: true });

describe('match', () => {
  describe('scoreHeaders', () => {
    it('should increment hits when header values match', () => {
      const score = freshScore();
      const _request = { headers: { 'content-type': 'application/json' } };
      const headers = { 'content-type': 'application/json' };

      match.scoreHeaders(score, _request, headers);

      expect(score.hits).toBe(1);
      expect(score.misses).toBe(0);
      expect(score.valid).toBe(true);
    });

    it('should decrement misses when header is missing from actual request', () => {
      const score = freshScore();
      const _request = { headers: { authorization: 'Bearer token' } };
      const headers = {};

      match.scoreHeaders(score, _request, headers);

      expect(score.hits).toBe(0);
      expect(score.misses).toBe(-1);
      expect(score.valid).toBe(true);
    });

    it('should set valid to false when header values differ', () => {
      const score = freshScore();
      const _request = { headers: { accept: 'text/html' } };
      const headers = { accept: 'application/json' };

      match.scoreHeaders(score, _request, headers);

      expect(score.hits).toBe(0);
      expect(score.valid).toBe(false);
    });

    it('should accumulate scores across multiple headers', () => {
      const score = freshScore();
      const _request = {
        headers: {
          'content-type': 'application/json',
          accept: 'text/html',
          authorization: 'Bearer abc'
        }
      };
      const headers = {
        'content-type': 'application/json',
        accept: 'text/html'
        // authorization missing
      };

      match.scoreHeaders(score, _request, headers);

      expect(score.hits).toBe(2);
      expect(score.misses).toBe(-1);
      expect(score.valid).toBe(true);
    });

    it('should return the score object', () => {
      const score = freshScore();
      const result = match.scoreHeaders(score, { headers: {} }, {});

      expect(result).toBe(score);
    });
  });

  describe('scoreParam', () => {
    it('should increment hits when values are equal', () => {
      const score = freshScore();

      match.scoreParam(score, 'abc', 'abc');

      expect(score.hits).toBe(1);
      expect(score.misses).toBe(0);
      expect(score.valid).toBe(true);
    });

    it('should increment misses when paramValue is missing', () => {
      const score = freshScore();

      match.scoreParam(score, 'abc', undefined);

      expect(score.misses).toBe(1);
      expect(score.hits).toBe(0);
      expect(score.valid).toBe(true);
    });

    it('should increment misses when paramValue is empty string', () => {
      const score = freshScore();

      match.scoreParam(score, 'abc', '');

      expect(score.misses).toBe(1);
      expect(score.valid).toBe(true);
    });

    it('should set valid to false when values differ', () => {
      const score = freshScore();

      match.scoreParam(score, 'abc', 'xyz');

      expect(score.hits).toBe(0);
      expect(score.misses).toBe(0);
      expect(score.valid).toBe(false);
    });
  });

  describe('scorePattern', () => {
    it('should increment hits when regex pattern matches', () => {
      const score = freshScore();

      match.scorePattern(score, { pattern: '^[1-3]$' }, '2');

      expect(score.hits).toBe(1);
      expect(score.valid).toBe(true);
    });

    it('should default to case-insensitive flag when no flags provided', () => {
      const score = freshScore();

      match.scorePattern(score, { pattern: '^hello$' }, 'HELLO');

      expect(score.hits).toBe(1);
      expect(score.valid).toBe(true);
    });

    it('should fall back to case-insensitive when flags is empty string (falsy)', () => {
      const score = freshScore();

      // flags: '' is falsy, so `flags || 'i'` defaults to 'i'
      match.scorePattern(score, { pattern: '^hello$', flags: '' }, 'HELLO');

      expect(score.hits).toBe(1);
      expect(score.valid).toBe(true);
    });

    it('should respect explicit case-sensitive flag', () => {
      const score = freshScore();

      // flags: 'g' is truthy and excludes 'i', so case-sensitive
      match.scorePattern(score, { pattern: '^hello$', flags: 'g' }, 'HELLO');

      expect(score.hits).toBe(0);
      expect(score.valid).toBe(false);
    });

    it('should set valid to false when pattern does not match', () => {
      const score = freshScore();

      match.scorePattern(score, { pattern: '^[1-3]$' }, '9');

      expect(score.valid).toBe(false);
      expect(score.hits).toBe(0);
    });

    it('should increment misses when paramValue is missing', () => {
      const score = freshScore();

      match.scorePattern(score, { pattern: '^[1-3]$' }, undefined);

      expect(score.misses).toBe(1);
      expect(score.hits).toBe(0);
      expect(score.valid).toBe(true);
    });

    it('should increment misses when paramValue is empty string', () => {
      const score = freshScore();

      match.scorePattern(score, { pattern: '^[1-3]$' }, '');

      expect(score.misses).toBe(1);
      expect(score.valid).toBe(true);
    });
  });

  describe('scoreArray', () => {
    it('should count all items as hits when arrays fully intersect', () => {
      const score = freshScore();

      match.scoreArray(score, ['a', 'b', 'c'], ['a', 'b', 'c']);

      expect(score.hits).toBe(3);
      expect(score.misses).toBe(0);
    });

    it('should count partial intersection as hits and remainder as misses', () => {
      const score = freshScore();

      match.scoreArray(score, ['a', 'b', 'c'], ['a', 'c']);

      expect(score.hits).toBe(2);
      expect(score.misses).toBe(1);
    });

    it('should count all items as misses when no intersection', () => {
      const score = freshScore();

      match.scoreArray(score, ['a', 'b'], ['x', 'y']);

      expect(score.hits).toBe(0);
      expect(score.misses).toBe(2);
    });

    it('should handle empty config array', () => {
      const score = freshScore();

      match.scoreArray(score, [], ['a', 'b']);

      expect(score.hits).toBe(0);
      expect(score.misses).toBe(0);
    });

    it('should handle empty paramValue', () => {
      const score = freshScore();

      match.scoreArray(score, ['a', 'b'], []);

      expect(score.hits).toBe(0);
      expect(score.misses).toBe(2);
    });

    it('should handle undefined paramValue via toArray', () => {
      const score = freshScore();

      match.scoreArray(score, ['a', 'b'], undefined);

      expect(score.hits).toBe(0);
      expect(score.misses).toBe(2);
    });

    it('should return the score object', () => {
      const score = freshScore();
      const result = match.scoreArray(score, [], []);

      expect(result).toBe(score);
    });
  });

  describe('scoreParams', () => {
    it('should score plain string params', () => {
      const _request = { params: { a: '1', b: '2' } };
      const params = { a: '1', b: '2' };

      const score = match.scoreParams(_request, params, 'get');

      expect(score.hits).toBe(2);
      expect(score.misses).toBe(0);
      expect(score.valid).toBe(true);
    });

    it('should score array params', () => {
      const _request = { params: { tags: ['a', 'b', 'c'] } };
      const params = { tags: ['a', 'c'] };

      const score = match.scoreParams(_request, params, 'get');

      expect(score.hits).toBe(2);
      expect(score.misses).toBe(1);
      expect(score.valid).toBe(true);
    });

    it('should score pattern params', () => {
      const _request = { params: { id: { pattern: '^\\d+$' } } };
      const params = { id: '42' };

      const score = match.scoreParams(_request, params, 'get');

      expect(score.hits).toBe(1);
      expect(score.valid).toBe(true);
    });

    it('should use direct key lookup for GET method', () => {
      const _request = { params: { 'a.b': 'value' } };
      const params = { 'a.b': 'value' };

      const score = match.scoreParams(_request, params, 'get');

      expect(score.hits).toBe(1);
      expect(score.valid).toBe(true);
    });

    it('should use lodash/get deep path lookup for POST method', () => {
      const _request = { params: { 'a.b': 'value' } };
      const params = { a: { b: 'value' } };

      const score = match.scoreParams(_request, params, 'post');

      expect(score.hits).toBe(1);
      expect(score.valid).toBe(true);
    });

    it('should NOT resolve dotted keys as deep paths for GET method', () => {
      const _request = { params: { 'a.b': 'value' } };
      const params = { a: { b: 'value' } };

      const score = match.scoreParams(_request, params, 'get');

      // GET uses params['a.b'] which is undefined, not lodash get(params, 'a.b')
      expect(score.hits).toBe(0);
      expect(score.misses).toBe(1);
    });

    it('should return a fresh score object', () => {
      const _request = { params: {} };

      const score = match.scoreParams(_request, {}, 'get');

      expect(score).toEqual({ hits: 0, misses: 0, valid: true });
    });

    it('should handle mixed param types', () => {
      const _request = {
        params: {
          name: 'test',
          ids: ['1', '2'],
          code: { pattern: '^[A-Z]+$' }
        }
      };
      const params = {
        name: 'test',
        ids: ['1', '2'],
        code: 'ABC'
      };

      const score = match.scoreParams(_request, params, 'get');

      expect(score.hits).toBe(4); // 1 (name) + 2 (ids intersection) + 1 (code pattern)
      expect(score.misses).toBe(0);
      expect(score.valid).toBe(true);
    });

    it('should invalidate score when any plain param mismatches', () => {
      const _request = { params: { a: '1', b: '2' } };
      const params = { a: '1', b: '999' };

      const score = match.scoreParams(_request, params, 'get');

      expect(score.valid).toBe(false);
    });
  });
});
