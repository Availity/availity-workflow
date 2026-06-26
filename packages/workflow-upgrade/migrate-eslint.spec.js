import { generateFlatConfig, formatRules } from './migrate-eslint.js';

describe('migrate-eslint', () => {
  describe('formatRules', () => {
    it('formats numeric severities as strings', () => {
      const result = formatRules({ 'no-console': 0, 'no-debugger': 2 });
      expect(result).toContain("'no-console': 'off'");
      expect(result).toContain("'no-debugger': 'error'");
    });

    it('formats array rules with severity conversion', () => {
      const result = formatRules({ indent: [2, 'tab'] });
      expect(result).toContain("'indent': ['error', \"tab\"]");
    });

    it('returns {} for empty rules', () => {
      expect(formatRules({})).toBe('{}');
    });
  });

  describe('generateFlatConfig', () => {
    it('generates config with availity/workflow extends', () => {
      const config = { extends: 'availity/workflow' };
      const result = generateFlatConfig(config, []);
      expect(result).toContain("import workflow from 'eslint-config-availity/workflow';");
      expect(result).toContain('...workflow,');
      expect(result).toContain('export default [');
    });

    it('generates config with availity/browser extends', () => {
      const config = { extends: ['availity/browser'] };
      const result = generateFlatConfig(config, []);
      expect(result).toContain("import browser from 'eslint-config-availity/browser';");
      expect(result).toContain('...browser,');
    });

    it('defaults to workflow import when extends is unknown', () => {
      const config = { extends: ['some-other-config'] };
      const result = generateFlatConfig(config, []);
      expect(result).toContain("import workflow from 'eslint-config-availity/workflow';");
    });

    it('includes rules in output', () => {
      const config = { extends: 'availity/workflow', rules: { 'no-console': 1 } };
      const result = generateFlatConfig(config, []);
      expect(result).toContain("'no-console': 'warn'");
    });

    it('converts overrides to separate config objects', () => {
      const config = {
        extends: 'availity/workflow',
        overrides: [{ files: ['*.test.js'], rules: { 'no-console': 0 } }],
      };
      const result = generateFlatConfig(config, []);
      expect(result).toContain("files: ['*.test.js']");
      expect(result).toContain("'no-console': 'off'");
    });

    it('includes ignore patterns', () => {
      const config = { extends: 'availity/workflow' };
      const result = generateFlatConfig(config, ['dist', 'coverage']);
      expect(result).toContain("ignores: ['dist', 'coverage']");
    });
  });
});
