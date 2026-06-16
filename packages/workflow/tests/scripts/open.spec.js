describe('open', () => {
  let open;
  let mockOpn;
  let mockLogger;

  beforeEach(async () => {
    vi.resetModules();

    mockOpn = vi.fn();
    vi.doMock('open', () => ({ default: mockOpn }));

    mockLogger = { info: vi.fn(), warn: vi.fn() };
    vi.doMock('@availity/workflow-logger', () => ({ default: mockLogger }));

    vi.doMock('chalk', () => ({ default: { green: (v) => v } }));

    const mod = await import('../../scripts/open.js');
    open = mod.default;
  });

  it('calls opn with constructed URL when settings.open() returns a path', async () => {
    const settings = { open: () => '/dashboard', port: () => 3000, host: () => 'localhost' };

    await open(settings);

    expect(mockOpn).toHaveBeenCalledWith('http://localhost:3000/dashboard');
  });

  it('calls opn with base URL when settings.open() returns "/"', async () => {
    const settings = { open: () => '/', port: () => 4000, host: () => '0.0.0.0' };

    await open(settings);

    expect(mockOpn).toHaveBeenCalledWith('http://0.0.0.0:4000/');
  });

  it('does not call opn when settings.open() returns falsy', async () => {
    const settings = { open: () => undefined, port: () => 3000, host: () => 'localhost' };

    await open(settings);

    expect(mockOpn).not.toHaveBeenCalled();
  });

  it('logs warning on error', async () => {
    mockOpn.mockImplementation(() => { throw new Error('spawn failed'); });
    const settings = { open: () => '/app', port: () => 3000, host: () => 'localhost' };

    await open(settings);

    expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('spawn failed'));
  });

  it('returns undefined when open path is not set', () => {
    const settings = { open: () => undefined, port: () => 3000, host: () => 'localhost' };

    const result = open(settings);

    expect(result).toBeUndefined();
  });
});
