const config = {
  coverageDirectory: '../../coverage/mock-data',
  displayName: 'mock-data',
  globals: {},
  cache: false,
  // https://github.com/swc-project/jest/issues/64#issuecomment-1029753225
  // moduleNameMapper: {
  //   '^(\\.{1,2}/.*)\\.js$': '$1',
  // },
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).js'],
  transform: {},
};

export default config;
