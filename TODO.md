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
