// Inspiration: https://github.com/facebookincubator/create-react-app/blob/master/packages/babel-preset-react-app/index.js
const path = require('path');
const settings = require('@availity/workflow-settings');

const workflowPlugins = [
  // @observer @observable
  [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],

  // class { handleClick = () => { } }
  [
    require.resolve('@babel/plugin-proposal-class-properties'),
    {
      loose: true
    }
  ],

  // Object.assign(a, b)
  require.resolve('@babel/plugin-transform-object-assign'),

  [
    require.resolve('@babel/plugin-proposal-object-rest-spread'),
    {
      useBuiltIns: true
    }
  ],

  require.resolve('@babel/plugin-transform-destructuring'),

  // Polyfills the runtime needed for async/await and generators
  [
    require.resolve('@babel/plugin-transform-runtime'),
    {
      corejs: false,
      helpers: false,
      regenerator: true,
      // Resolve the Babel runtime relative to the config
      absoluteRuntime: path.dirname(require.resolve('@babel/runtime/package.json'))
    }
  ],

  // Adds syntax support for import()
  require.resolve('@babel/plugin-syntax-dynamic-import')
];

let config;

if (settings.isTesting()) {
  // this will not work for Angular/Karma
  config = {
    presets: [
      // ES features necessary for user's Node version
      [
        require.resolve('@babel/preset-env'),
        {
          targets: {
            node: 'current'
          }
        }
      ],
      // JSX, Flow
      // Transforms JSX
      [
        require.resolve('@babel/preset-react'),
        {
          development: settings.isDevelopment() || settings.isTesting(),
          useBuiltIns: true
        }
      ]
    ],
    plugins: workflowPlugins.concat([
      // Compiles import() to a deferred require()
      require.resolve('babel-plugin-dynamic-import-node')
    ])
  };
} else {
  config = {
    presets: [
      // Latest stable ECMAScript features
      [
        require.resolve('@babel/preset-env'),
        {
          targets: settings.targets(),
          forceAllTransforms: settings.isDistribution(),
          ignoreBrowserslistConfig: true,
          modules: false,
          useBuiltIns: false,
          exclude: ['transform-typeof-symbol']
        }
      ],
      [
        require.resolve('@babel/preset-react'),
        {
          development: settings.isDevelopment() || settings.isTesting(),
          useBuiltIns: true
        }
      ]
    ],
    plugins: workflowPlugins.concat(
      // Tells the es2015 preset to avoid compiling import statements into CommonJS. That lets Webpack do tree shaking on your code. // Disable polyfill transforms // JSX, Flow
      [
        // Angular bombs
        require.resolve('@babel/plugin-transform-shorthand-properties')
      ]
    )
  };
}
module.exports = () => config;
