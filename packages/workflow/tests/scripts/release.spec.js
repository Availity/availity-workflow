describe('release', () => {
  let release;
  let mockVersion;
  let mockLint;
  let mockBuild;
  let mockLogger;

  beforeEach(async () => {
    vi.resetModules();

    mockVersion = {
      prompt: vi.fn(),
      bump: vi.fn(),
      tag: vi.fn()
    };
    vi.doMock('../../scripts/version.js', () => ({ default: mockVersion }));

    mockLint = vi.fn();
    vi.doMock('../../scripts/lint.js', () => ({ default: mockLint }));

    mockBuild = vi.fn();
    vi.doMock('../../scripts/build.js', () => ({ default: mockBuild }));

    mockLogger = { info: vi.fn(), success: vi.fn(), failed: vi.fn() };
    vi.doMock('@availity/workflow-logger', () => ({ default: mockLogger }));

    const mod = await import('../../scripts/release.js');
    release = mod.default;
  });

  const settings = { name: 'mock-settings' };

  it('runs the full pipeline in order: prompt → lint → bump → build → tag', async () => {
    const order = [];
    mockVersion.prompt.mockImplementation(() => order.push('prompt'));
    mockLint.mockImplementation(() => order.push('lint'));
    mockVersion.bump.mockImplementation(() => order.push('bump'));
    mockBuild.mockImplementation(() => order.push('build'));
    mockVersion.tag.mockImplementation(() => order.push('tag'));

    await release({ settings });

    expect(order).toEqual(['prompt', 'lint', 'bump', 'build', 'tag']);
  });

  it('passes settings to all pipeline steps', async () => {
    await release({ settings });

    expect(mockVersion.prompt).toHaveBeenCalledWith(settings, undefined);
    expect(mockLint).toHaveBeenCalledWith({ settings });
    expect(mockVersion.bump).toHaveBeenCalledWith(settings);
    expect(mockBuild).toHaveBeenCalledWith({ settings });
    expect(mockVersion.tag).toHaveBeenCalledWith(settings);
  });

  it('logs success on completion', async () => {
    await release({ settings });

    expect(mockLogger.info).toHaveBeenCalledWith('Started releasing');
    expect(mockLogger.success).toHaveBeenCalledWith('Finished releasing');
  });

  it('stops pipeline and re-throws when lint fails', async () => {
    mockLint.mockRejectedValue(new Error('lint failed'));

    await expect(release({ settings })).rejects.toThrow('lint failed');

    expect(mockVersion.bump).not.toHaveBeenCalled();
    expect(mockBuild).not.toHaveBeenCalled();
    expect(mockVersion.tag).not.toHaveBeenCalled();
  });

  it('stops pipeline and re-throws when build fails', async () => {
    mockBuild.mockRejectedValue(new Error('build failed'));

    await expect(release({ settings })).rejects.toThrow('build failed');

    expect(mockVersion.tag).not.toHaveBeenCalled();
  });

  it('logs failure details before re-throwing', async () => {
    const error = new Error('something broke');
    mockVersion.prompt.mockRejectedValue(error);

    await expect(release({ settings })).rejects.toThrow('something broke');

    expect(mockLogger.failed).toHaveBeenCalledWith(expect.stringContaining('something broke'));
  });
});
