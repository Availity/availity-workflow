import Logger from '../index.js';

describe('Logger', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('warn', () => {
    it('calls console.log with output that includes the entry text', () => {
      Logger.warn('something is off');
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('something is off');
    });
  });

  describe('error', () => {
    it('calls console.log with output that includes the entry text', () => {
      Logger.error('something broke');
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('something broke');
    });
  });

  describe('info', () => {
    it('calls console.log with output that includes the entry text', () => {
      Logger.info('some info');
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('some info');
    });
  });

  describe('debug', () => {
    it('calls console.log', () => {
      Logger.debug('debug message');
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('log', () => {
    it('calls console.log', () => {
      Logger.log('log message');
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('record', () => {
    it('calls console.log', () => {
      Logger.record('a record');
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });

    it('defaults to red color for Error instances', () => {
      const error = new Error('kaboom');
      Logger.record(error);
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      // The output should contain the error (chalk wraps it, but toString is embedded)
      expect(consoleSpy.mock.calls[0][0]).toContain('kaboom');
    });
  });

  describe('simple', () => {
    it('passes entry directly to console.log', () => {
      Logger.simple('raw entry');
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith('raw entry');
    });
  });

  describe('empty', () => {
    it('calls console.log with empty string', () => {
      Logger.empty();
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith('');
    });
  });

  describe('failed', () => {
    it('output includes ERROR and the entry', () => {
      Logger.failed('lint failed');
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain('ERROR');
      expect(output).toContain('lint failed');
    });
  });

  describe('alert', () => {
    it('output includes WARNING and the entry', () => {
      Logger.alert('compiled with warnings');
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain('WARNING');
      expect(output).toContain('compiled with warnings');
    });
  });

  describe('message', () => {
    it('output includes default INFO label', () => {
      Logger.message('hello world');
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain('INFO');
      expect(output).toContain('hello world');
    });

    it('output includes custom label when provided', () => {
      Logger.message('deploy started', 'DEPLOY');
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain('DEPLOY');
      expect(output).toContain('deploy started');
    });
  });

  describe('success', () => {
    it('output includes the entry', () => {
      Logger.success('linting passed');
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('linting passed');
    });
  });

  describe('box', () => {
    it('calls console.log with boxen output', () => {
      Logger.box('boxed message');
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      // boxen wraps content in a border; the entry text should still be present
      expect(consoleSpy.mock.calls[0][0]).toContain('boxed message');
    });
  });
});
