'use strict';

// Inspiration: https://github.com/facebookincubator/create-react-app/blob/master/config/babel.dev.js

const settings = require('../settings');

module.exports = {

  // Don't try to find .babelrc because we want to force this configuration.
  babelrc: false,

  // This is a feature of `babel-loader` for webpack (not Babel itself).
  // It enables caching results in OS temporary directory for faster rebuilds.
  cacheDirectory: settings.isDevelopment(),

  presets: [
    // let, const, destructuring, classes, modules
    [require.resolve('babel-preset-es2015'), {'loose': true}],

    // JSX, Flow
    require.resolve('babel-preset-react')
  ],

  plugins: [
    // class { handleClick = () => { } }
    require.resolve('babel-plugin-transform-class-properties'),

    // Object.assign(a, b)
    require.resolve('babel-plugin-transform-object-assign'),

    // { ...todo, completed: true }
    require.resolve('babel-plugin-transform-object-rest-spread')
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
