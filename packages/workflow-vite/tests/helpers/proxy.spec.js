import toViteProxy from '../../helpers/proxy.js';

describe('toViteProxy()', () => {
  it('returns undefined when proxies is null', () => {
    expect(toViteProxy(null)).toBeUndefined();
  });

  it('returns undefined when proxies is undefined', () => {
    expect(toViteProxy(undefined)).toBeUndefined();
  });

  it('returns undefined when all proxies are disabled', () => {
    const result = toViteProxy([{ context: '/api', target: 'http://localhost:9999', enabled: false }]);
    expect(result).toBeUndefined();
  });

  it('returns undefined when proxies array is empty', () => {
    expect(toViteProxy([])).toBeUndefined();
  });

  it('converts a single proxy with string context', () => {
    const result = toViteProxy([{ context: '/api', target: 'http://localhost:9999', enabled: true }]);
    expect(result).toHaveProperty('/api');
    expect(result['/api'].target).toBe('http://localhost:9999');
    expect(result['/api'].changeOrigin).toBe(true);
    expect(result['/api'].ws).toBe(true);
  });

  it('expands array context into multiple entries', () => {
    const result = toViteProxy([{ context: ['/api', '/ms'], target: 'http://localhost:9999', enabled: true }]);
    expect(result).toHaveProperty('/api');
    expect(result).toHaveProperty('/ms');
    expect(result['/api'].target).toBe('http://localhost:9999');
    expect(result['/ms'].target).toBe('http://localhost:9999');
  });

  it('skips disabled proxy entries', () => {
    const result = toViteProxy([
      { context: '/api', target: 'http://localhost:9999', enabled: false },
      { context: '/ms', target: 'http://localhost:9999', enabled: true },
    ]);
    expect(result).not.toHaveProperty('/api');
    expect(result).toHaveProperty('/ms');
  });

  it('includes headers when provided', () => {
    const result = toViteProxy([
      {
        context: '/api',
        target: 'http://localhost:9999',
        enabled: true,
        headers: { RemoteUser: 'jsmith', 'X-Custom': 'value' },
      },
    ]);
    expect(result['/api'].headers).toEqual({ RemoteUser: 'jsmith', 'X-Custom': 'value' });
  });

  it('omits headers property when none provided', () => {
    const result = toViteProxy([{ context: '/api', target: 'http://localhost:9999', enabled: true }]);
    expect(result['/api']).not.toHaveProperty('headers');
  });

  it('creates a rewrite function when pathRewrite is provided', () => {
    const result = toViteProxy([
      {
        context: '/api',
        target: 'http://localhost:9999',
        enabled: true,
        pathRewrite: { '^/api': '' },
      },
    ]);
    expect(typeof result['/api'].rewrite).toBe('function');
  });

  it('rewrite function applies the regex replacement', () => {
    const result = toViteProxy([
      {
        context: '/api',
        target: 'http://localhost:9999',
        enabled: true,
        pathRewrite: { '^/api': '' },
      },
    ]);
    expect(result['/api'].rewrite('/api/users')).toBe('/users');
  });

  it('rewrite function applies multiple rewrites in order', () => {
    const result = toViteProxy([
      {
        context: '/svc',
        target: 'http://localhost:9999',
        enabled: true,
        pathRewrite: { '^/svc': '/service', '/v1': '/v2' },
      },
    ]);
    expect(result['/svc'].rewrite('/svc/v1/data')).toBe('/service/v2/data');
  });

  it('omits rewrite when no pathRewrite provided', () => {
    const result = toViteProxy([{ context: '/api', target: 'http://localhost:9999', enabled: true }]);
    expect(result['/api']).not.toHaveProperty('rewrite');
  });

  it('handles proxy with ws explicitly false', () => {
    const result = toViteProxy([{ context: '/api', target: 'http://localhost:9999', enabled: true, ws: false }]);
    expect(result['/api'].ws).toBe(false);
  });

  it('enables proxy when enabled is undefined (default true behavior)', () => {
    const result = toViteProxy([{ context: '/api', target: 'http://localhost:9999' }]);
    expect(result).toHaveProperty('/api');
  });
});
