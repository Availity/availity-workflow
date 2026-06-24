import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const mockVitestInstance = { close: vi.fn() };
const mockStartVitest = vi.fn(() => mockVitestInstance);

vi.mock('vitest/node', () => ({ startVitest: mockStartVitest }));
vi.mock('../../vitest.config.js', () => ({ default: () => ({}) }));

const { default: test } = await import('../../scripts/test.js');

describe('test runner', () => {
  let mockExit;

  beforeEach(() => {
    mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {});
    mockStartVitest.mockClear();
    mockVitestInstance.close.mockClear();
    mockStartVitest.mockImplementation(() => mockVitestInstance);
  });

  afterEach(() => {
    mockExit.mockRestore();
  });

  it('calls vitest', async () => {
    const settings = { testRunner: () => 'vitest', argv: () => ({}) };

    await test({ settings });

    expect(mockStartVitest).toHaveBeenCalledWith('run', [], undefined, { configFile: false });
  });

  it('sets NODE_ENV to test', async () => {
    process.env.NODE_ENV = 'development';
    const settings = { testRunner: () => 'vitest', argv: () => ({}) };

    await test({ settings });

    expect(process.env.NODE_ENV).toBe('test');
  });

  it('closes vitest instance after running', async () => {
    const settings = { testRunner: () => 'vitest', argv: () => ({}) };

    await test({ settings });

    expect(mockVitestInstance.close).toHaveBeenCalled();
  });

  it('throws when vitest fails to start', async () => {
    mockStartVitest.mockResolvedValue(null);
    const settings = { testRunner: () => 'vitest', argv: () => ({}) };

    await expect(test({ settings })).rejects.toThrow('Vitest failed to start');
  });
});
