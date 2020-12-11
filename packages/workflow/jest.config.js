/* eslint-disable jest/no-jest-import */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
// https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/scripts/utils/createJestConfig.js
const path = require('path');

const jest = require('jest');
const { existsSync } = require('fs');

function create(settings) {
  settings.init();
  const rootDir = settings.project();
  const jestInitExists = existsSync(`${path.join(settings.app(), 'jest.init.js')}`);

  const setupFilesPath = path.join(settings.project(), 'jest.setup.js');
  const setupFilesExist = existsSync(setupFilesPath);

  const setupFiles = setupFilesExist ? [`${require.resolve(setupFilesPath)}`] : [];

  // Allow developers to add their own node_modules include path
  const userInclude = settings.configuration.development.babelInclude;
  const includes = ['@av', ...userInclude].join('|');

  const config = {
    collectCoverageFrom: ['project/app/**/*.{js,jsx,ts,tsx}'],
    coveragePathIgnorePatterns: ['/node_modules/', '/coverage/', '/dist/'],
    testEnvironment: 'node',
    testURL: 'http://localhost',
    transform: {
      // Jest and Babel don't allow functions in the options so we just return their values here
      '^.+\\.(js|jsx|ts|tsx)$': `${require.resolve('./jest/babel.js')}`,
      '^.+\\.css$': `${require.resolve('./jest/css.js')}`,
      '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': `${require.resolve('./jest/file.js')}`
    },
    setupFiles: [require.resolve('raf/polyfill'), ...setupFiles],
    setupFilesAfterEnv: jestInitExists
      ? require(path.join(settings.app(), 'jest.init.js'))
      : ['@testing-library/jest-dom/extend-expect'],
    transformIgnorePatterns: [`[/\\\\]node_modules[/\\\\](?!(${includes})).+\\.(js|jsx|ts|tsx)$`],
    testMatch: [
      // Ignore the following directories:
      // build
      //   - the build output directory
      // .cache
      //   - the yarn module cache on Ubuntu if $HOME === rootDir
      // docs
      //   - often used to publish to Github Pages
      // node_modules
      //   - ignore tests in dependencies
      // dist
      //   - the dist output directory
      '<rootDir>/!(build|docs|dist|node_modules|scripts)/**/__tests__/**/*.(js|ts|tsx)?(x)',
      '<rootDir>/!(build|docs|dist|node_modules|scripts)/**/*(*.)(spec|test).(js|ts|tsx)?(x)'
    ],
    globals: settings.globals()
  };

  if (rootDir) {
    config.rootDir = rootDir;
  }

  return config;
}

function unit(settings) {
  const argv = process.argv.slice(2);
  const jestConfig = JSON.stringify(create(settings));
  argv.push(`--config=${jestConfig}`);
  argv.push('--env=jsdom');

  jest.run(argv);

  return Promise.resolve();
}

module.exports = (settings) => ({
  run: () => unit(settings),
  description: 'Run your tests using Jest'
});
