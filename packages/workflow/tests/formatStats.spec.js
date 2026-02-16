import formatWebpackMessages from '../scripts/format.js';
import formatStats from '../scripts/stats.js';

describe('formatWebpackMessages', () => {
  const makeJson = (errors = [], warnings = []) => ({
    errors: errors.map((msg) => ({ message: msg })),
    warnings: warnings.map((msg) => ({ message: msg }))
  });

  it('returns empty arrays when no errors or warnings', () => {
    const result = formatWebpackMessages(makeJson());
    expect(result).toEqual({ errors: [], warnings: [] });
  });

  it('strips webpack loader notation from filenames', () => {
    const result = formatWebpackMessages(
      makeJson(['./~/css-loader!./~/postcss-loader!./src/App.css\nModule not found: Cannot resolve module some-module\n\n./src/App.css 1:0'])
    );
    expect(result.errors[0]).toContain('./src/App.css');
    expect(result.errors[0]).not.toContain('css-loader');
    expect(result.errors[0]).not.toContain('postcss-loader');
  });

  it('cleans "Module not found" messages', () => {
    const result = formatWebpackMessages(
      makeJson(["./src/App.css\nModule not found: Cannot resolve module 'some-module'\nExtra line 1\nExtra line 2\n./src/App.css 10:0"])
    );
    const error = result.errors[0];
    expect(error).toContain('Module not found:');
    expect(error).not.toContain('Cannot resolve module');
    expect(error).toContain('./src/App.css 10:0');
  });

  it('cleans "Module build failed: SyntaxError" messages', () => {
    const result = formatWebpackMessages(
      makeJson(['./src/App.css\nModule build failed: SyntaxError: Unexpected token (5:2)\n\n  3 |\n  4 |   render() {\n> 5 |   }\n'])
    );
    const error = result.errors[0];
    expect(error).toContain('Syntax error:');
    expect(error).not.toContain('Module build failed');
  });

  it('strips internal stack traces without webpack:', () => {
    const result = formatWebpackMessages(
      makeJson(['./src/App.css\nSome error\n  at Object.<anonymous> (/path/to/file.js:1:2)\n  at Module._compile (internal/modules.js:3:4)\nEnd'])
    );
    const error = result.errors[0];
    expect(error).not.toContain('at Object.<anonymous>');
    expect(error).not.toContain('at Module._compile');
    expect(error).toContain('End');
  });

  it('preserves stack traces containing webpack:', () => {
    const result = formatWebpackMessages(
      makeJson(['./src/App.css\nSome error\n  at Object.<anonymous> (webpack:///./src/App.css:1:2)\nEnd'])
    );
    const error = result.errors[0];
    expect(error).toContain('at Object.<anonymous> (webpack:///./src/App.css:1:2)');
  });

  it('wraps errors with "Error in" prefix', () => {
    const result = formatWebpackMessages(makeJson(['./src/App.css\nSome error']));
    expect(result.errors[0]).toMatch(/^Error in /);
  });

  it('wraps warnings with "Warning in" prefix', () => {
    const result = formatWebpackMessages(makeJson([], ['./src/App.css\nSome warning']));
    expect(result.warnings[0]).toMatch(/^Warning in /);
  });

  it('filters to only syntax errors when any syntax error exists', () => {
    const result = formatWebpackMessages(
      makeJson([
        './src/App.css\nModule build failed: SyntaxError: Unexpected token\ncode line',
        './src/Other.css\nSome other error'
      ])
    );
    // Syntax errors get filtered, and then capped at 1
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain('Syntax error:');
    expect(result.errors[0]).not.toContain('Some other error');
  });

  it('caps errors at 1', () => {
    const result = formatWebpackMessages(
      makeJson([
        './src/A.css\nError one',
        './src/B.css\nError two',
        './src/C.css\nError three'
      ])
    );
    expect(result.errors).toHaveLength(1);
  });
});

describe('formatStats', () => {
  const createMockStats = () => ({
    toString: vi.fn(() => 'formatted output')
  });

  it('calls stats.toString() with correct default options', () => {
    const stats = createMockStats();
    const result = formatStats(stats);

    expect(stats.toString).toHaveBeenCalledWith({
      colors: true,
      cached: true,
      reasons: false,
      source: false,
      chunks: false,
      modules: false,
      chunkModules: false,
      chunkOrigins: false,
      children: false,
      errorDetails: true,
      warnings: true
    });
    expect(result).toBe('formatted output');
  });

  it('passes through errorDetails and warnings options', () => {
    const stats = createMockStats();
    formatStats(stats, { errorDetails: false, warnings: false });

    expect(stats.toString).toHaveBeenCalledWith(
      expect.objectContaining({
        errorDetails: false,
        warnings: false
      })
    );
  });
});
