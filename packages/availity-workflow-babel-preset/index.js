// Inspiration: https://github.com/facebookincubator/create-react-app/blob/master/config/babel.dev.js
const path = require('path');
const settings = require('availity-workflow-settings');

const config = {

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

  ]
};

if (settings.isDevelopment() || settings.isTesting()) {

  // The following two plugins are currently necessary to make React warnings
  // include more valuable information. They are included here because they are
  // currently not enabled in babel-preset-react. See the below threads for more info:
  // https://github.com/babel/babel/issues/4702
  // https://github.com/babel/babel/pull/3540#issuecomment-228673661
  // https://github.com/facebookincubator/create-react-app/issues/989
  config.plugins.push.apply([
    // Adds component stack to warning messages
    require.resolve('babel-plugin-transform-react-jsx-source'),
    // Adds __self attribute to JSX which React will use for some warnings
    require.resolve('babel-plugin-transform-react-jsx-self')
  ]);

}

module.exports = config;
