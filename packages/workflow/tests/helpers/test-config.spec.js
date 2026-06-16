import { buildTransformIncludePattern, baseTransformPackages } from '../../helpers/test-config.js';

describe('buildTransformIncludePattern', () => {
  it('includes all base packages', () => {
    const settings = { configuration: { development: { babelInclude: [] } } };
    const result = buildTransformIncludePattern(settings);

    for (const pkg of baseTransformPackages) {
      expect(result).toContain(pkg);
    }
  });

  it('appends user babelInclude packages', () => {
    const settings = { configuration: { development: { babelInclude: ['my-pkg', '@custom/lib'] } } };
    const result = buildTransformIncludePattern(settings);

    expect(result).toContain('my-pkg');
    expect(result).toContain('@custom/lib');
  });

  it('returns a pipe-separated string', () => {
    const settings = { configuration: { development: { babelInclude: [] } } };
    const result = buildTransformIncludePattern(settings);

    expect(result).not.toContain(' ');
    expect(result.split('|').length).toBe(baseTransformPackages.length);
  });
});
