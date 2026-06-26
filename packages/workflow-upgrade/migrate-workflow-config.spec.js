import { convertToESM, removeDeadConfigKeys } from './migrate-workflow-config.js';

describe('migrate-workflow-config', () => {
  describe('convertToESM', () => {
    it('converts require statements to imports', () => {
      const input = `const path = require('path');\nconst { foo } = require('bar');\n`;
      const result = convertToESM(input);
      expect(result).toContain("import path from 'path';");
      expect(result).toContain("import { foo } from 'bar';");
      expect(result).not.toContain('require');
    });

    it('converts module.exports to export default', () => {
      const input = `module.exports = (config) => {\n  return config;\n};\n`;
      const result = convertToESM(input);
      expect(result).toContain('export default (config) => {');
      expect(result).not.toContain('module.exports');
    });

    it('handles a full CJS file', () => {
      const input = [
        "const path = require('path');",
        '',
        'module.exports = (config) => {',
        "  config.development.open = '/';",
        '  return config;',
        '};',
      ].join('\n');
      const result = convertToESM(input);
      expect(result).toContain("import path from 'path';");
      expect(result).toContain('export default (config) => {');
    });

    it('leaves already-ESM source unchanged', () => {
      const input = `import path from 'path';\nexport default (config) => config;\n`;
      const result = convertToESM(input);
      expect(result).toBe(input);
    });
  });

  describe('removeDeadConfigKeys', () => {
    it('removes config.eslint with configType', () => {
      const input = `  config.eslint = { configType: 'flat' };\n  config.development.open = '/';\n`;
      const result = removeDeadConfigKeys(input);
      expect(result).not.toContain('config.eslint');
      expect(result).toContain("config.development.open = '/'");
    });

    it('removes jestOverrides with unsupported keys', () => {
      const input = [
        'config.development.jestOverrides = {',
        "  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },",
        '};',
        '',
      ].join('\n');
      const result = removeDeadConfigKeys(input);
      expect(result).not.toContain('jestOverrides');
    });

    it('keeps jestOverrides with only supported keys', () => {
      const input = ['config.development.jestOverrides = {', "  collectCoverageFrom: ['src/**/*.js'],", '};', ''].join(
        '\n'
      );
      const result = removeDeadConfigKeys(input);
      expect(result).toContain('jestOverrides');
    });

    it('returns source unchanged when no dead keys', () => {
      const input = "config.development.open = '/';\n";
      expect(removeDeadConfigKeys(input)).toBe(input);
    });
  });
});
