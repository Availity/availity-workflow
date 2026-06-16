const { default: proxy } = await import('../../scripts/proxy.js');

describe('proxy() webpack format', () => {
  const mockSettings = {
    port: () => 3000,
    host: () => 'localhost',
    configuration: {}
  };

  it('returns null when proxies is undefined', () => {
    expect(proxy({ ...mockSettings, configuration: {} })).toBeNull();
  });

  it('returns null when proxies is empty array', () => {
    expect(proxy({ ...mockSettings, configuration: { proxies: [] } })).toBeNull();
  });

  it('returns null when all proxies are disabled', () => {
    const settings = {
      ...mockSettings,
      configuration: {
        proxies: [
          { context: '/api', target: 'http://localhost:8080', enabled: false }
        ]
      }
    };
    expect(proxy(settings)).toBeNull();
  });

  it('returns array of enabled proxy configs with merged defaults', () => {
    const settings = {
      ...mockSettings,
      configuration: {
        proxies: [
          { context: '/api', target: 'http://localhost:8080', enabled: true }
        ]
      }
    };
    const result = proxy(settings);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      context: '/api',
      target: 'http://localhost:8080',
      changeOrigin: true,
      ws: true,
      xfwd: true
    });
  });

  it('onProxyReq rewrites origin and referer headers from localhost to target', () => {
    const settings = {
      ...mockSettings,
      configuration: {
        proxies: [
          { context: '/api', target: 'http://localhost:8080', enabled: true }
        ]
      }
    };
    const result = proxy(settings);
    const proxyReq = {
      getHeader: vi.fn((h) => {
        if (h === 'referer') return 'http://localhost:3000/api/users';
        if (h === 'origin') return 'http://localhost:3000';
        return null;
      }),
      setHeader: vi.fn()
    };

    result[0].onProxyReq(proxyReq, {});

    expect(proxyReq.setHeader).toHaveBeenCalledWith('referer', 'http://localhost:8080/api/users');
    expect(proxyReq.setHeader).toHaveBeenCalledWith('origin', 'http://localhost:8080');
  });

  it('onProxyReq skips rewrite when contextRewrite is false', () => {
    const settings = {
      ...mockSettings,
      configuration: {
        proxies: [
          { context: '/api', target: 'http://localhost:8080', enabled: true, contextRewrite: false }
        ]
      }
    };
    const result = proxy(settings);
    const proxyReq = {
      getHeader: vi.fn(() => 'http://localhost:3000/api'),
      setHeader: vi.fn()
    };

    result[0].onProxyReq(proxyReq, {});

    expect(proxyReq.setHeader).not.toHaveBeenCalled();
  });

  it('onProxyRes rewrites location header from target to localhost', () => {
    const settings = {
      ...mockSettings,
      configuration: {
        proxies: [
          { context: '/api', target: 'http://localhost:8080', enabled: true }
        ]
      }
    };
    const result = proxy(settings);
    const proxyRes = {
      headers: { location: 'http://localhost:8080/api/redirect' }
    };

    result[0].onProxyRes(proxyRes, {}, {});

    expect(proxyRes.headers.location).toBe('http://localhost:3000/api/redirect');
  });

  it('onProxyRes skips rewrite when contextRewrite is false', () => {
    const settings = {
      ...mockSettings,
      configuration: {
        proxies: [
          { context: '/api', target: 'http://localhost:8080', enabled: true, contextRewrite: false }
        ]
      }
    };
    const result = proxy(settings);
    const proxyRes = {
      headers: { location: 'http://localhost:8080/something' }
    };

    result[0].onProxyRes(proxyRes, {}, {});

    expect(proxyRes.headers.location).toBe('http://localhost:8080/something');
  });

  it('onError writes 500 and error message', () => {
    const settings = {
      ...mockSettings,
      configuration: {
        proxies: [
          { context: '/api', target: 'http://localhost:8080', enabled: true }
        ]
      }
    };
    const result = proxy(settings);
    const req = { url: '/api/fail', headers: { host: 'localhost:3000' } };
    const res = { writeHead: vi.fn(), end: vi.fn(), headersSent: false };

    result[0].onError(new Error('connection refused'), req, res);

    expect(res.writeHead).toHaveBeenCalledWith(500);
    expect(res.end).toHaveBeenCalledWith(expect.stringContaining('/api/fail'));
  });

  it('onError does not call writeHead when headers already sent', () => {
    const settings = {
      ...mockSettings,
      configuration: {
        proxies: [
          { context: '/api', target: 'http://localhost:8080', enabled: true }
        ]
      }
    };
    const result = proxy(settings);
    const req = { url: '/api/fail', headers: { host: 'localhost:3000' } };
    const res = { writeHead: vi.fn(), end: vi.fn(), headersSent: true };

    result[0].onError(new Error('timeout'), req, res);

    expect(res.writeHead).not.toHaveBeenCalled();
    expect(res.end).toHaveBeenCalled();
  });

  it('calls user-provided onProxyReq after internal handler', () => {
    const userHook = vi.fn();
    const settings = {
      ...mockSettings,
      configuration: {
        proxies: [
          { context: '/api', target: 'http://localhost:8080', enabled: true, onProxyReq: userHook }
        ]
      }
    };
    const result = proxy(settings);
    const proxyReq = { getHeader: vi.fn(() => null), setHeader: vi.fn() };

    result[0].onProxyReq(proxyReq, {});

    expect(userHook).toHaveBeenCalledWith(proxyReq, {});
  });
});


