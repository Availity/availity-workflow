// https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/utils/createJestConfig.js
const jest = require('jest');
const settings = require('availity-workflow-settings');
const Promise = require('bluebird');

function create() {

  const rootDir = settings.project();

  const config = {
    collectCoverageFrom: ['project/app/**/*.{js,jsx}'],
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/coverage/',
      '/dist/'
    ],
    testEnvironment: 'node',
    testURL: 'http://localhost',
    transform: {
      '^.+\\.(js|jsx)$': `${require.resolve('./jest/babel.js')}`,
      '^.+\\.css$': `${require.resolve('./jest/css.js')}`,
      '^(?!.*\\.(js|jsx|css|json)$)': `${require.resolve('./jest/file.js')}`

    },
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'
    ],
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
      '<rootDir>/!(build|docs|dist|node_modules|scripts)/**/__tests__/**/*.js?(x)',
      '<rootDir>/!(build|docs|dist|node_modules|scripts)/**/?(*.)(spec|test).js?(x)'
    ],
    globals: settings.globals()
  };

  if (rootDir) {
    config.rootDir = rootDir;
  }

  return config;

}

function unit() {

  const argv = process.argv.slice(2);
  const jestConfig = JSON.stringify(create());
  argv.push(`--config=${jestConfig}`);
  argv.push('--env=jsdom');

  jest.run(argv);

  return Promise.resolve();

}

module.exports = {
  run: unit,
  description: 'Run your tests using Jest'
};

