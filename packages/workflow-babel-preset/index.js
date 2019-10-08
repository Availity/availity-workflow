// Inspiration: https://github.com/facebookincubator/create-react-app/blob/master/packages/babel-preset-react-app/index.js
const path = require('path');

module.exports = (_, settings) => {
  const isProduction = typeof settings.isProduction === 'function' ? settings.isProduction() : settings.isProduction;
  const isDevelopment = typeof settings.isDevelopment === 'function' ? settings.isDevelopment() : settings.isDevelopment;
  const isTesting = typeof settings.isTesting === 'function' ? settings.isTesting() : settings.isTesting;
  const isDistribution = typeof settings.isDistribution === 'function' ? settings.isDistribution() : settings.isDistribution;
  const targets = typeof settings.targets === 'function' ? settings.targets() : settings.targets;


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

  if (isProduction) {
    workflowPlugins.concat([
      // Remove "data-test-id", "data-testid" attributes from production builds.
      require.resolve('babel-plugin-jsx-remove-data-test-id'),
      {
        attributes: ['data-test-id', 'data-testid']
      }
    ]);
  }

  let config;

  if (isTesting) {
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
            development: isDevelopment || isTesting,
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
            targets,
            forceAllTransforms: isDistribution,
            ignoreBrowserslistConfig: true,
            modules: false,
            useBuiltIns: false,
            exclude: ['transform-typeof-symbol']
          }
        ],
        [
          require.resolve('@babel/preset-react'),
          {
            development: isDevelopment || isTesting,
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

  return config;
};
