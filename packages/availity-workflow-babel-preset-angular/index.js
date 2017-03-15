// Inspiration: https://github.com/facebookincubator/create-react-app/blob/master/packages/babel-preset-react-app/index.js
const path = require('path');
const settings = require('availity-workflow-settings');

const wfPlugins = [

  // @observer @observable
  require.resolve('babel-plugin-transform-decorators-legacy'),

  // class { handleClick = () => { } }
  require.resolve('babel-plugin-transform-class-properties'),

  // Object.assign(a, b)
  require.resolve('babel-plugin-transform-object-assign'),

  [
    require.resolve('babel-plugin-transform-object-rest-spread'),
    {
      useBuiltIns: true
    }
  ],

  // Polyfills the runtime needed for async/await and generators
  [require.resolve('babel-plugin-transform-runtime'), {
    helpers: false,
    polyfill: false,
    regenerator: true,
    // Resolve the Babel runtime relative to the config.
    // You can safely remove this after ejecting:
    moduleName: path.dirname(require.resolve('babel-runtime/package'))
  }]
];

const config = {
  presets: [
    // Latest stable ECMAScript features
    [
      require.resolve('babel-preset-env'),
      {
        targets: settings.targets(),
        // Tells the es2015 preset to avoid compiling import statements into CommonJS. That lets Webpack do tree shaking on your code.
        modules: false,
        // Disable polyfill transforms
        useBuiltIns: false
      }
    ],
    // JSX, Flow
    require.resolve('babel-preset-stage-0')
  ],
  plugins: wfPlugins.concat([
    // function* () { yield 42; yield 43; }
    [
      require.resolve('babel-plugin-transform-regenerator'),
      {
        // Async functions are converted to generators by babel-preset-env
        async: false
      }
    ],
    // Adds syntax support for import()
    require.resolve('babel-plugin-syntax-dynamic-import'),
    // Angular bombs without this transform when using shorthand for controllers in ui-router
    require.resolve('babel-plugin-transform-es2015-shorthand-properties')
  ])
};


module.exports = config;
