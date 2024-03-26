// eslint-disable-next-line jest/no-jest-import
import type { Config } from 'jest';

const includes = ['@av', '@availity'].join('|');

const config: Config = {
  moduleNameMapper: {
    // '^axios$': require.resolve('axios'),
    // ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/../../' }),
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|html)$': 'ts-jest',
  },
  transformIgnorePatterns: [`[/\\\\]node_modules[/\\\\](?!(${includes})).+\\.(js|jsx)$`],
};

export default config;
