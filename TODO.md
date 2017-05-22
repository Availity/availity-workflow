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

- [https://github.com/darrenscerri/duplicate-package-checker-webpack-plugin](https://github.com/darrenscerri/duplicate-package-checker-webpack-plugin)

- [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin)

- [unused-files-webpack-plugin](https://github.com/tomchentw/unused-files-webpack-plugin)

- Code splitting
    - https://gist.github.com/sokra/27b24881210b56bbaff7#code-splitting-with-es6
    - https://github.com/facebookincubator/create-react-app/pull/1801/files

- [https://github.com/novemberborn/babel-plugin-import-glob](https://github.com/novemberborn/babel-plugin-import-glob)

```js
function onClick() {
    System.import("./module").then(module => {
        module.default;
    }).catch(err => {
        console.log("Chunk loading failed");
    });
}
```

- [https://github.com/luisrudge/postcss-flexbugs-fixes](https://github.com/luisrudge/postcss-flexbugs-fixes)

```js
{
loader: require.resolve('postcss-loader'),
options: {
  ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
  plugins: () => [
    require('postcss-flexbugs-fixes'),
    autoprefixer({
      browsers: [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie < 9', // React doesn't support IE8 anyway
      ],
      flexbox: 'no-2009',
    }),
  ],
}
```

- Upgrade [less-loader v4](https://github.com/webpack-contrib/less-loader)
