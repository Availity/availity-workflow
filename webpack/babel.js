'use strict';

// Inspiration: https://github.com/facebookincubator/create-react-app/blob/master/config/babel.dev.js
const path = require('path');
const exists = require('exists-sync');
const settings = require('../settings');
const findCacheDir = require('find-cache-dir');

const babelrcPath = path.join(settings.project(), '.babelrc');
const babelrcExists = exists(babelrcPath);
const config = {};

// This is a feature of `babel-loader` for webpack (not Babel itself).
// It enables caching results in OS temporary directory for faster rebuilds.
if (settings.isDevelopment()) {
  config.cacheDirectory = findCacheDir({ name: 'availity-workflow' });
}

const userBabelrc = {
  babelrc: true
};

const workflowBabelrc = {

  // Don't try to find .babelrc because we want to force this configuration.
  babelrc: false,

  presets: [
    // let, const, destructuring, classes, modules
    [require.resolve('babel-preset-latest'), {
      'es2015': {
        loose: true
      }
    }],

    // JSX, Flow
    require.resolve('babel-preset-react'),

    require.resolve('babel-preset-stage-0')
  ],

  plugins: [
    // @observer @observable
    require.resolve('babel-plugin-transform-decorators-legacy'),

    // class { handleClick = () => { } }
    require.resolve('babel-plugin-transform-class-properties'),

    // Object.assign(a, b)
    require.resolve('babel-plugin-transform-object-assign'),

    // { ...todo, completed: true }
    require.resolve('babel-plugin-transform-object-rest-spread'),

    // const Component = props =>
    // <div className='myComponent'>
      // {do {
        // if(color === 'blue') { <BlueComponent/>; }
        // if(color === 'red') { <RedComponent/>; }
        // if(color === 'green') { <GreenComponent/>; }
      // }}
    // </div>;
    require.resolve('babel-plugin-transform-do-expressions'),

    [require.resolve('babel-plugin-transform-regenerator'), {
      // Async functions are converted to generators by babel-preset-latest
      async: false
    }],

    // Polyfills the runtime needed for async/await and generators
    [require.resolve('babel-plugin-transform-runtime'), {
      helpers: false,
      polyfill: false,
      regenerator: true,
      // Resolve the Babel runtime relative to the config.
      // You can safely remove this after ejecting:
      moduleName: path.dirname(require.resolve('babel-runtime/package'))
    }]

  ],

  env: {
    test: {
      plugins: [
        ['istanbul',
          {
            exclude: [
              '**/*-spec.js',
              'module.js',
              'spec.js',
              'vendor.js'
            ]
          }
        ]
      ]
    }
  }
};

// Allow project to use their own babel plugins.
babelrcExists ? Object.assign(config, userBabelrc) : Object.assign(config, workflowBabelrc);

module.exports = config;
