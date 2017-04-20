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

- Invetigate [https://github.com/darrenscerri/duplicate-package-checker-webpack-plugin](https://github.com/darrenscerri/duplicate-package-checker-webpack-plugin)

- Investigate [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin)

- Investigate [unused-files-webpack-plugin](https://github.com/tomchentw/unused-files-webpack-plugin)

- Investigate code splitting
    - https://gist.github.com/sokra/27b24881210b56bbaff7#code-splitting-with-es6
    - https://github.com/facebookincubator/create-react-app/pull/1801/files

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
- Upgrade [less-loader v4](https://github.com/webpack-contrib/less-loader)
