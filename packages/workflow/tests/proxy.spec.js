// Mock settings singleton before importing proxy.js
vi.doMock('../settings/index.js', () => ({
  default: {
    port: () => 3000,
    host: () => 'localhost',
    configuration: { proxies: [] }
  }
}));

const { toViteProxy } = await import('../scripts/proxy.js');

describe('toViteProxy', () => {
  it('returns undefined for null input', () => {
    expect(toViteProxy(null)).toBeUndefined();
  });

  it('returns undefined for undefined input', () => {
    expect(toViteProxy(undefined)).toBeUndefined();
  });

  it('returns undefined for empty array', () => {
    expect(toViteProxy([])).toBeUndefined();
  });

  it('returns undefined when all proxies are disabled', () => {
    const proxies = [
      { context: '/api', target: 'http://localhost:8080', enabled: false },
      { context: '/ms', target: 'http://localhost:9090', enabled: false }
    ];

    expect(toViteProxy(proxies)).toBeUndefined();
  });

  it('converts a single context string proxy', () => {
    const proxies = [{ context: '/api', target: 'http://localhost:8080', enabled: true }];

    const result = toViteProxy(proxies);

    expect(result).toEqual(
      expect.objectContaining({
        '/api': expect.objectContaining({
          target: 'http://localhost:8080'
        })
      })
    );
  });

  it('converts an array of contexts into multiple entries', () => {
    const proxies = [
      { context: ['/api', '/ms', '/health'], target: 'http://localhost:8080', enabled: true }
    ];

    const result = toViteProxy(proxies);

    expect(Object.keys(result)).toEqual(['/api', '/ms', '/health']);
    expect(result['/api'].target).toBe('http://localhost:8080');
    expect(result['/ms'].target).toBe('http://localhost:8080');
    expect(result['/health'].target).toBe('http://localhost:8080');
  });

  it('sets changeOrigin: true on all entries', () => {
    const proxies = [
      { context: ['/api', '/ms'], target: 'http://localhost:8080', enabled: true }
    ];

    const result = toViteProxy(proxies);

    expect(result['/api'].changeOrigin).toBe(true);
    expect(result['/ms'].changeOrigin).toBe(true);
  });

  it('sets ws: true by default', () => {
    const proxies = [{ context: '/api', target: 'http://localhost:8080', enabled: true }];

    const result = toViteProxy(proxies);

    expect(result['/api'].ws).toBe(true);
  });

  it('sets ws: false when explicitly configured as false', () => {
    const proxies = [{ context: '/api', target: 'http://localhost:8080', enabled: true, ws: false }];

    const result = toViteProxy(proxies);

    expect(result['/api'].ws).toBe(false);
  });

  it('copies headers when present', () => {
    const headers = { 'X-Custom-Header': 'value', Authorization: 'Bearer token' };
    const proxies = [{ context: '/api', target: 'http://localhost:8080', enabled: true, headers }];

    const result = toViteProxy(proxies);

    expect(result['/api'].headers).toEqual(headers);
  });

  it('omits headers when not present', () => {
    const proxies = [{ context: '/api', target: 'http://localhost:8080', enabled: true }];

    const result = toViteProxy(proxies);

    expect(result['/api']).not.toHaveProperty('headers');
  });

  it('creates a rewrite function from pathRewrite', () => {
    const proxies = [
      {
        context: '/api',
        target: 'http://localhost:8080',
        enabled: true,
        pathRewrite: { '^/api': '' }
      }
    ];

    const result = toViteProxy(proxies);

    expect(typeof result['/api'].rewrite).toBe('function');
  });

  it('rewrite function correctly applies regex replacement', () => {
    const proxies = [
      {
        context: '/api',
        target: 'http://localhost:8080',
        enabled: true,
        pathRewrite: { '^/api': '' }
      }
    ];

    const result = toViteProxy(proxies);

    expect(result['/api'].rewrite('/api/users')).toBe('/users');
    expect(result['/api'].rewrite('/api')).toBe('');
  });

  it('rewrite function handles multiple pathRewrite rules', () => {
    const proxies = [
      {
        context: '/api',
        target: 'http://localhost:8080',
        enabled: true,
        pathRewrite: { '^/api': '/v2', '/old': '/new' }
      }
    ];

    const result = toViteProxy(proxies);

    expect(result['/api'].rewrite('/api/old/resource')).toBe('/v2/new/resource');
  });

  it('omits rewrite when pathRewrite is not present', () => {
    const proxies = [{ context: '/api', target: 'http://localhost:8080', enabled: true }];

    const result = toViteProxy(proxies);

    expect(result['/api']).not.toHaveProperty('rewrite');
  });

  it('skips disabled proxies while keeping enabled ones', () => {
    const proxies = [
      { context: '/api', target: 'http://localhost:8080', enabled: true },
      { context: '/internal', target: 'http://localhost:9090', enabled: false },
      { context: '/ms', target: 'http://localhost:7070', enabled: true }
    ];

    const result = toViteProxy(proxies);

    expect(Object.keys(result)).toEqual(['/api', '/ms']);
    expect(result).not.toHaveProperty('/internal');
  });

  it('complete conversion with all options', () => {
    const proxies = [
      {
        context: ['/api', '/ms'],
        target: 'http://localhost:8080',
        enabled: true,
        pathRewrite: { '^/api': '' },
        headers: { 'X-Session': 'abc123' },
        ws: true
      }
    ];

    const result = toViteProxy(proxies);

    // /api entry has all fields
    expect(result['/api']).toEqual(
      expect.objectContaining({
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
        headers: { 'X-Session': 'abc123' }
      })
    );
    expect(typeof result['/api'].rewrite).toBe('function');
    expect(result['/api'].rewrite('/api/v1/users')).toBe('/v1/users');

    // /ms entry also has headers and rewrite (pathRewrite applies to all contexts)
    expect(result['/ms']).toEqual(
      expect.objectContaining({
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
        headers: { 'X-Session': 'abc123' }
      })
    );
    expect(typeof result['/ms'].rewrite).toBe('function');
  });
});
