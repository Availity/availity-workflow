- Simply Webpack configurations

```
├── webpack
|   └── index.js
|   └── base.js
|   └── dev.js
|   └── prod.js
|   └── test.js
```

```js
// index.js

if (settings.isProduction()) {
  module.exports = require('./prod');
} else {
  module.exports = require('./dev');
}
```
- Investigate [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin)
- Investigate [unused-files-webpack-plugin](https://github.com/tomchentw/unused-files-webpack-plugin)
- Add ability to devine environment variables

```js
 // Useful for having development builds with debug logging or adding global constants
new DefinePlugin({
  'ENV': JSON.stringify(ENV),
  'HMR': false,
  'process.env': {
    'ENV': JSON.stringify(ENV),
    'API_URL': JSON.stringify(API_URL),
    'NODE_ENV': JSON.stringify(ENV),
    'HMR': false
  }
})
```
- Investigate [code splitting](// https://gist.github.com/sokra/27b24881210b56bbaff7#code-splitting-with-es6)

```js
function onClick() {
    System.import("./module").then(module => {
        module.default;
    }).catch(err => {
        console.log("Chunk loading failed");
    });
}
```
- Make Angular 3rd party libs optional
```
// Optional 3rd party libraries.
//
// Comment or remove the entries below to reduce if you are not using
// them in your application.  Reducing the bundle size of your application
// reduces the perceived load time of your page.
//
// An error will be thrown if a module is used that requires one of the 3rd party
// libraries below.
```
