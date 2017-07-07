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
