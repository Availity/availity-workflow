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
      useBuiltIns: true,
    },
  ],
  // Transforms JSX
  [
    require.resolve('babel-plugin-transform-react-jsx'),
    {
      useBuiltIns: true,
    },
  ],

  // Polyfills the runtime needed for async/await and generators
  [
    require.resolve('babel-plugin-transform-runtime'),
    {
      helpers: false,
      polyfill: false,
      regenerator: true,
      // Resolve the Babel runtime relative to the config
      moduleName: path.dirname(require.resolve('babel-runtime/package')),
    },
  ],
];

if (settings.isDevelopment() || settings.isTesting()) {
  // The following two plugins are currently necessary to make React warnings
  // include more valuable information. They are included here because they are
  // currently not enabled in babel-preset-react. See the below threads for more info:
  // https://github.com/babel/babel/issues/4702
  // https://github.com/babel/babel/pull/3540#issuecomment-228673661
  // https://github.com/facebookincubator/create-react-app/issues/989
  wfPlugins.push.apply(wfPlugins, [
    // Adds component stack to warning messages
    require.resolve('babel-plugin-transform-react-jsx-source'),
    // Adds __self attribute to JSX which React will use for some warnings
    require.resolve('babel-plugin-transform-react-jsx-self'),
  ]);
}

let config;

if (settings.isTesting()) {
  // this will not work for Angular/Karma
  config = {
    presets: [
      // ES features necessary for user's Node version
      [
        require('babel-preset-env').default,
        {
          targets: {
            node: 'current',
          },
        },
      ],
      // JSX, Flow
      require.resolve('babel-preset-react'),
      require.resolve('babel-preset-stage-0'),
    ],
    plugins: wfPlugins.concat([
      // Compiles import() to a deferred require()
      require.resolve('babel-plugin-dynamic-import-node'),
    ]),
  };
} else {
  config = {
    presets: [
      // Latest stable ECMAScript features
      [
        require.resolve('babel-preset-env'),
        {
          targets: settings.targets(),
          // Tells the es2015 preset to avoid compiling import statements into CommonJS. That lets Webpack do tree shaking on your code.
          modules: false,
          // Disable polyfill transforms
          useBuiltIns: false,
        },
      ],
      // JSX, Flow
      require.resolve('babel-preset-react'),
      require.resolve('babel-preset-stage-0'),
    ],
    plugins: wfPlugins.concat([
      // function* () { yield 42; yield 43; }
      [
        require.resolve('babel-plugin-transform-regenerator'),
        {
          // Async functions are converted to generators by babel-preset-env
          async: false,
        },
      ],
      // Adds syntax support for import()
      require.resolve('babel-plugin-syntax-dynamic-import'),
      // Angular bombs
      require.resolve('babel-plugin-transform-es2015-shorthand-properties'),
    ]),
  };
}
module.exports = config;
