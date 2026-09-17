---
title: 'Reference: Workflow Configuration'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

## Features

- Files placed in `project/app/static` will automatically get copied to the build directory. This can be useful when an application needs to reference static documents like images and PDFs without having to import them using Webpack. The files would be accessible through the path `static` relative to the application.
- A global variable `APP_VERSION` is written to javascript bundle that can be used to determine the version of the application that was deployed. Open up the browser debugger and type `APP_VERSION`.
- Hook into Vitest setup by adding `vitest.setup.js` at the root of your project

> For Vite-based projects using `@availity/workflow-vite`, see the [workflow-vite README](https://github.com/Availity/availity-workflow/tree/master/packages/workflow-vite).

## Configuration

`workflow` can be configured using a javascript or yaml configuration file called `workflow.js` or `workflow.yml`.
`workflow.js` or `workflow.yml` lives in `<application_root>/project/config/workflow.js`

**Example:**

```js
export default {
  development: {
    notification: true,
    hotLoader: true,
  },
  app: {
    title: 'My Awesome App',
  },
  mock: {
    latency: 300,
    port: 9999,
  },
  proxies: [
    {
      context: '/api',
      target: `http://localhost:9999`,
      enabled: true,
      logLevel: 'info',
      pathRewrite: {
        '^/api': '',
      },
      headers: {
        RemoteUser: 'janedoe',
      },
    },
  ],
};
```

`workflow` can also be configured using `package.json`:

```json
{
  "name": "foo",
  "availityWorkflow": {
    "development": {
      "notification": true,
      "hotLoader": true
    },
    "app": {
      "title": "My Awesome App"
    }
  }
}
```

If `workflow.js` exports a function it can be used to override properties from the default configuration. The function must return a configuration.

```js
function merge(config) {
  config.development.open = '#/foo';
  return config;
}

export default merge;
```

### Options

#### `development.open`

Opens the url in the default browser

#### `development.notification`

Webpack build status system notifications

<img src={useBaseUrl('img/notification.png')} className="w-50 mb-2" alt="notification" />

#### `development.host`

Webpack dev server host

#### `development.port`

Webpack dev server port. If the port at this value is unavailable, the port value will be incremented until an unused port is found.
Default: `3000`

#### `development.stats.level`

Allows [Webpack log levels presets](https://webpack.js.org/configuration/stats/#stats) to be used during development.

#### `development.sourceMap`

Webpack `devtool` setting. Default is `source-map`. For more options please see https://webpack.js.org/configuration/devtool/#devtool.

#### `development.hotLoader`

Enable or disable Fast Refresh using [`react-refresh`](https://github.com/pmmmwh/react-refresh-webpack-plugin). Default is `true`.

#### `development.webpackDevServer`

> **Caution**: Please be careful when overriding defaults

Optional options for Webpack development server. If undefined, `workflow` defaults are used. Please see https://webpack.js.org/configuration/dev-server/#devserver for all available options.

#### `development.targets`

Allows developers to override the `webpack` target to match their developer environment. This is beneficial if a developer is doing their primary development environment in a browser like Chrome 57+ that already supports a lot of the ES6 features, therefore, not needing to Babelfy code completely.

This setting is is only used for development and does not effect staging/production/testing builds which default to `'browserslist: defaults'`. **@See** [https://webpack.js.org/configuration/target/](https://webpack.js.org/configuration/target/)

**Examples:**

```js
targets: 'web';
```

```js
targets: ['web', 'es5'];
```

```js
targets: 'browserslist: last 1 chrome version, last 1 firefox version, last 1 safari version';
```

#### `development.babelInclude`

Include additional packages from `node_modules` that should be compiled by Babel and Webpack. The default is to compile all packages that are prefixed with `@av/`

#### `development.jestOverrides`

> **Deprecated.** Use `development.vitestOverrides` instead. `jestOverrides` is a legacy compatibility shim that maps a small subset of Jest config keys to their Vitest equivalents. Only three keys are recognized: `collectCoverageFrom`, `coveragePathIgnorePatterns`, and `testTimeout`. All other keys are silently ignored.

**Supported (legacy) mappings:**

```js
{
  collectCoverageFrom: ['project/app/**/*.{js,jsx,ts,tsx}', '!project/app/**/*.d.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/coverage/', '/dist/', '/types'],
  testTimeout: 15000,
}
```

#### `development.vitestOverrides`

The preferred way to customize Vitest. Options are merged additively with the workflow defaults — you only need to specify what you want to change.

| Option              | Type                    | Description                                                                                           |
| ------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------- |
| `pool`              | string                  | `'vmThreads'` (default), `'forks'`, or `'threads'`                                                    |
| `environment`       | string                  | `'jsdom'` (default), `'happy-dom'`, or `'node'`                                                       |
| `testTimeout`       | number                  | Test timeout in ms (default: 5000)                                                                    |
| `setupFiles`        | string \| string[]      | Additional setup files — appended to the internal list                                                |
| `inlineDeps`        | string \| RegExp \| ... | Extra packages to inline through Vite's transform pipeline                                            |
| `fallbackCJS`       | boolean                 | Try CJS build for packages with broken ESM (default: `true`)                                          |
| `optimizeDeps`      | string \| string[]      | Extra packages to pre-bundle for faster startup                                                       |
| `exclude`           | string \| string[]      | Additional glob patterns to exclude from test discovery                                               |
| `resolveConditions` | string[]                | Override the module resolution condition list (default: `['browser', 'module', 'import', 'default']`) |
| `coverage`          | object                  | Any [Vitest coverage options](https://vitest.dev/config/#coverage) — merged with defaults             |

> **Note on `clearMocks`:** Vitest 5 changed the default for `clearMocks` to `true`. `@availity/workflow` explicitly pins it to `false` to preserve existing test behavior. If you want mocks auto-cleared before each test, opt in via `vitestOverrides.clearMocks: true`.

**Example:**

```js
export default (config) => {
  config.development.vitestOverrides = {
    testTimeout: 15000,
    setupFiles: ['./vitest.setup.js'],
    coverage: {
      all: true,
      provider: 'istanbul',
      thresholds: { statements: 80 },
    },
  };
  return config;
};
```

#### `development.suppressDeprecationWarnings`

Suppress Node.js deprecation warnings during builds and dev server startup. Default: `false`.

Enable this if third-party dependencies emit noisy deprecation warnings that you cannot resolve:

```js
export default {
  development: {
    suppressDeprecationWarnings: true,
  },
};
```

#### `app.title`

Page title to use for the generated HTML document. Default is `Availity`.

```html
<html>
  <head>
    <title>Availity</title>
  </head>
</html>
```

#### `globals`

Create globals to be used for feature flags. Globals must be defined in the workflow configuration file before they can be used as flags by a project.

```js
globals: {
    BROWSER_SUPPORTS_HTML5: true,
    EXPERIMENTAL_FEATURE: false
}
```

Once declared, override the default flag values from the command line .

**Ex:**

```bash
EXPERIMENTAL_FEATURE=true npm run production
```

By default, the following feature flags are enabled:

- `__DEV__`: **true** when `process.env.NODE_ENV` is **development**
- `__TEST__`: **true** when `process.env.NODE_ENV` is **test**
- `__PROD__`: **true** when `process.env.NODE_ENV` is **production**
- `__STAGING__`: **true** when `process.env.NODE_ENV` is **staging**
- `process.env.NODE_ENV`: is `development`, `test`, `staging` or `production` accordingly.

#### `ekko`

Mock server configuration (uses `@availity/mock-server` internally).

| Option          | Default                      | Description                                            |
| --------------- | ---------------------------- | ------------------------------------------------------ |
| `enabled`       | `true`                       | Enable/disable the mock server                         |
| `port`          | `9999`                       | Mock server port                                       |
| `latency`       | `250`                        | Default response delay in ms                           |
| `data`          | `project/data`               | Folder containing mock data files (JSON, images, etc.) |
| `routes`        | `project/config/routes.json` | Path to the Express route configuration file           |
| `plugins`       | `['@availity/mock-data']`    | NPM modules that add additional routes and data        |
| `pluginContext` | `http://{host}:{port}/api`   | Context URL for HATEOAS links in mock responses        |

#### `proxies`

Array of proxy configurations. A default configuration is enabled to proxy requests to the mock server. Each proxy configuration can have the following attributes.

- `context`: URL context used to match the activation of the proxy per request.

**Ex:**:

```js
context: '/api';
```

- `target`: Host and port number for proxy.
- `enabled`: Enables or disables a proxy configuration
- `pathRewrite`: _(Optional)_ Rewrites (using regex) the path before sending request to proxy target.

**Ex:**

```js
pathRewrite: {
  '^/api': ''
}
```

- `contextRewrite`: _(Optional)_ Does not work with multiple proxy contexts. When `true`:

  - Rewrites the `Origin` and `Referer` headers from host to match the the proxy target url.
  - Rewrites the `Location` header from proxy to the host url.
  - Rewrites any urls of the response body (JSON only) to match the url of the host. Only URLs that match the proxy target are rewritten. This feature is useful if the proxy server sends back HATEOS links that need to work on the host. The proxy context is automatically appended to the host url if missing the a URL response.

- `headers`: _(Optional)_ Send default headers to the proxy destination.

**Ex:**:

```js
headers: {
  RemoteUser: 'janedoe';
}
```

#### `modifyWebpackConfig`

A function which, when provided, can be used to enhance/override or replace the webpack configuration used. The function will be invoked with the current webpack configuration object and a reference to the workflow settings.

**Ex:**

```js
modifyWebpackConfig: (webpackConfig, settings) => {
  // Add Subresource Integrity (SRI) security feature
  webpackConfig.output = { crossOriginLoading: 'anonymous' };
  // Note: SriPlugin would be imported in your workflow.js to be referenced here
  webpackConfig.plugins.push(
    new SriPlugin({
      hashFuncNames: ['sha256', 'sha384'],
      // only enable it for non-development builds
      enabled: !settings.isDevelopment(),
    })
  );
  return webpackConfig;
};
```

## FAQ

### How to setup a development environment to match the deployment environment?

Update `workflow.js` using the configuration below:

```js
export default (config) => {
  config.proxies = [
    {
      context: ['/api/**', '/ms/**', '!/api/v1/proxy/healthplan/**'],
      target: 'http://localhost:9999',
      enabled: true,
      logLevel: 'debug',
      pathRewrite: {
        '^/api': '',
      },
    },
    {
      context: ['/api/v1/proxy/healthplan/some/mock/path'],
      target: 'http://localhost:9999',
      enabled: true,
      logLevel: 'debug',
      pathRewrite: {
        '^/api': '',
      },
    },
    {
      context: ['/api/v1/proxy/healthplan/**'],
      target: 'http://localhost:8888',
      enabled: true,
      logLevel: 'debug',
      pathRewrite: {
        '^/api/v1/proxy/healthplan/': '',
      },
    },
  ];
  return config;
};
```

The configuration above does the following:

- Proxy requests starting with `/ms` or `/api` to the mock server but not paths that haves segments `/api/v1/proxy/healthplan/`. This configuration allows the Availity API to be simulated from mock server.
- Proxy requests with path `/api/v1/proxy/healthplan/some/mock/path` to the mock server. Optional configuration that is useful if an API is not available for use and needs to be mocked.
- Proxy all requests with path segments `/api/v1/proxy/healthplan/` to the configured target `'http://localhost:8888'`. Notice the URL is being rewritten. Change the rewrite path to match your local path as needed. This configuration is useful when testing against live services.
