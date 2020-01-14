---
title: Introduction
summary: Toolkit for Availity web projects. Heavily inspired by create-react-app.
---

## Features

-   Files placed in `project/app/static` will automatically get copied to the build directory. This can be useful when an application needs to reference static documents like images and PDFs without having to import them using Webpack. The files would be accessible through the path `static` relative to the application.
-   A global variable `APP_VERSION` is written to javascript bundle that can be used to determine the version of the application that was deployed. Open up the browser debugger and type `APP_VERSION`.
-   Hook into Jest `setupFiles` by adding `jest.setup.js` at the root of your project

## Configuration

`workflow` can be configured using a javascript or yaml configuration file called `workflow.js` or `workflow.yml`.
`workflow.js` or `workflow.yml` lives in `<application_root>/project/config/workflow.js`

**Example:**

```js
module.exports = {
    development: {
        notification: true
        hot: true
    },
    app: {
        title: 'My Awesome App'
    }
    mock: {
        latency: 300,
        port: 9999
    },
    proxies: [
        {
            context: '/api',
            target: `http://localhost:9999`,
            enabled: true,
            logLevel: 'info',
            pathRewrite: {
            '^/api': ''
            },
            headers: {
                RemoteUser: 'janedoe'
            }
        }
    ]
}
```

`workflow` can also be configured using `package.json`:

```js
{
    "name": "foo",
    "availityWorkflow": {
        development: {
            notification: true
            hot: true
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

module.exports = merge;
```

### Options

#### `development.open`

Opens the url in the default browser

#### `development.notification`

Webpack build status system notifications

<img src="./images/notification.png" className="w-50 mb-2" alt="notification" />

#### `development.host`

Webpack dev server host

#### `development.port`

Webpack dev server port. If the port at this value is unavailable, the port value will be incremented until an unused port if found.
Default: `3000`

#### `development.logLevel`

Allows [Webpack log levels presets](https://webpack.js.org/configuration/stats/#stats) to be used during development. A custom logger is used by default.

#### `development.sourceMap`

Webpack `devtool` setting. Default is `source-map`. For more options please see https://webpack.js.org/configuration/devtool/#devtool.

#### `development.hotLoader`

Enable or disable react-hot-loader. Default is `true`.

Can also be an object to enable experimental `react-refresh` features
ex.

```json
{
    "hotLoader": {
        "enabled": true,
        "experimental": true
    }
}
```

#### `development.webpackDevServer`

> **Caution**: Please be careful when overriding defaults

Optional options for Webpack development server. If undefined, `workflow` defaults are used. Please see https://webpack.js.org/configuration/dev-server/#devserver for all available options.

#### `development.targets`

Allows developers to override the `babel-preset-env` target to match their developer environment. This is beneficial if a developer is doing their primary development environment in a browser like Chrome 57+ that already supports a lot of the ES6 features, therefore, not needing to Babelfy code completely.

This setting is is only used for development and does not effect staging/production/testing builds which default to `IE11`. **@See** [https://github.com/babel/babel-preset-env](https://github.com/babel/babel-preset-env)

**Examples:**

```js
targets: {
    ie: 11;
}
```

```js
targets: {
    browsers: ['last 2 Chrome versions'];
}
```

```js
targets: {
    chrome: 57;
}
```

#### `development.babelInclude`

Include additinal packages from `node_modules` that should be compiled by Babel and Wepback. The default is to compile all packages that are prefixed with `@av/`

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

-   `__DEV__`: **true** when `process.env.NODE_ENV` is **development**
-   `__TEST__`: **true** when `process.env.NODE_ENV` is **test**
-   `__PROD__`: **true** when `process.env.NODE_ENV` is **production**
-   `__STAGING__`: **true** when `process.env.NODE_ENV` is **staging**
-   `process.env.NODE_ENV`: is `development`, `test`, `staging` or `production` accordingly.

> `eslint-config-availity@2.1.0` or higher is needed for the default feature toggles to be recognized as valid globals by **eslint**.

#### `mock.enabled`

Enables or disables mock server. Default is `true`.

#### `mock.port`

Mock server port number. If the port is unavailable, a random available port will be used.

Note: we will automatically update the proxy settings to reflect the port used in the case of a random port being selected.

#### `mock.latency`

Sets default latency for all mock responses

#### `mock.data`

Folder that contains the mock data files (json, images, etc). Defaults to `project/data`.

#### `mock.path`

Path to route configuration file used by Mock server to build Express routes. Defaults to `project/config/routes.json`.

#### `mock.plugins`

Array of NPM module names that enhance mock server with additional data and routes. @See https://github.com/Availity/@availity/mock-data

#### `mock.pluginContext`

Pass URL context information to mock responses so that HATEOS links traverse correctly. Defaults to `http://localhost:{development.port}/api`

#### `proxies`

Array of proxy configurations. A default configuration is enabled to proxy requests to the mock server. Each proxy configuration can have the following attributes.

-   `context`: URL context used to match the activation of the proxy per request.

**Ex:**:

```js
context: '/api';
```

-   `target`: Host and port number for proxy.
-   `enabled`: Enables or disables a proxy configuration
-   `pathRewrite`: _(Optional)_ Rewrites (using regex) the a path before sending request to proxy target.

**Ex:**

```js
pathRewrite: {
  '^/api': ''
}
```

-   `contextRewrite`: _(Optional)_ Does not work with multiple proxy contexts. When `true`:

    -   Rewrites the `Origin` and `Referer` headers from host to match the the proxy target url.
    -   Rewrites the `Location` header from proxy to the host url.
    -   Rewrites any urls of the response body (JSON only) to match the url of the host. Only URLs that match the proxy target are rewritten. This feature is useful if the proxy server sends back HATEOS links that need to work on the host. The proxy context is automatically appended to the host url if missing the a URL response.

-   `headers`: _(Optional)_ Send default headers to the proxy destination.

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
            enabled: !settings.isDevelopment()
        })
    );
    return webpackConfig;
};
```

## FAQ

### How to integrate with Visual Studio Code's [Jest plugin](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest)?

Create `./vscode/settings.json` file with the following configuration:

```json
{
    "jest.pathToJest": "npm test -- --runInBand"
}
```

**Note**: The Jest plugin will still warn about Jest 20+ features missing but it doesn't appear to affect the plugins's functionality

### How to setup a development environment to match the deployment environment?

Update `workflow.js` using the configuration below:

```js
module.exports = config => {
    config.proxies = [
        {
            context: ['/api/**', '/ms/**', '!/api/v1/proxy/healthplan/**'],
            target: 'http://localhost:9999',
            enabled: true,
            logLevel: 'debug',
            pathRewrite: {
                '^/api': ''
            }
        },
        {
            context: ['/api/v1/proxy/healthplan/some/mock/path'],
            target: 'http://localhost:9999',
            enabled: true,
            logLevel: 'debug',
            pathRewrite: {
                '^/api': ''
            }
        },
        {
            context: ['/api/v1/proxy/healthplan/**'],
            target: 'http://localhost:8888',
            enabled: true,
            logLevel: 'debug',
            pathRewrite: {
                '^/api/v1/proxy/healthplan/': ''
            }
        }
    ];
    return config;
};
```

The configuration above does the following:

-   Proxy requests starting with `/ms` or `/api` to the mock server but not paths that haves segments `/api/v1/proxy/healthplan/`. This configuration allows the Availity API to be simulated from mock server.
-   Proxy requests with path `/api/v1/proxy/healthplan/some/mock/path` to the mock server. Optional configuration that is useful if an API is not available for use and needs to be mocked.
-   Proxy all requests with path segments `/api/v1/proxy/healthplan/` to the configured target `'http://localhost:8888'`. Notice the URL is being rewritten. Change the rewrite path to match your local path as needed. This configuration is useful when testing against live services.

## Contributing

-   Run `yarn`
-   Use `yarn start:app` to start the React sample application
