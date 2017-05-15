# availity-workflow

> Upgradable workflow for Availity boilerplate projects

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square&label=license)](http://opensource.org/licenses/MIT)
[![NPM](http://img.shields.io/npm/v/availity-workflow.svg?style=flat-square&label=npm)](https://npmjs.org/package/availity-workflow)

![CLI](/docs/cli.png)


## Table of Contents
* [Getting Started](#getting-started)
* [Configuration](#configuration)
* [CLI](packages/availity-workflow/README.md)
* [License](#license)

## Getting Started

- Install using NPM

```bash
npm install availity-workflow --save-dev
```

- Install the appropriate plugin

### React
```bash
npm install availity-workflow-react --save-dev
```

### Angular
```bash
npm install availity-workflow-angular --save-dev
```

- Update `packge.json` with plugin reference

```json
{
    "availityWorkflow": {
        "plugin": "availity-workflow-react"
    }
}
```

- Install developer tools

```
npm install eslint eslint eslint-config-availity eslint-plugin-react babel-eslint ---save-dev
```

## Configuration

`availity-workflow` can be configured using a javascript or yaml configuration file called `workflow.js` or `workflow.yml`

**Example:**
```js
module.exports = {
    development: {
        notification: true
        hot: true
    },
    ekko: {
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

### Options

#### `development.open`
Opens the url in the default browser

#### `development.notification`
Webpack build status system notifications

![Notification](/docs/notification.png)

#### `development.host`
Webpack dev server host

#### `development.port`
Webpack dev server port

#### `development.logLevel`
Allows [Webpack log levels presets](https://webpack.js.org/configuration/stats/#stats) to be used during development. A custom logger is used by default.

#### `development.sourceMap`
Webpack `devtool` setting.  Default is `source-map`.  For more options please see https://webpack.js.org/configuration/devtool/#devtool.

#### `development.hot`
Enable hot module replacement for loaders like  style-loader and react-hot-loader

#### `development.hotLoader`
Enable or disable react-hot-loader.  Default is `true` for `availity-workflow-react` plugin.

#### `development.targets`
Allows developers to override the `babel-preset-env` target to match their developer environment.  This is benefecial if a developer is doing their primary development environment in a browser like Chrome 57+ that already supports a lot of the ES6, therefore, not needing to Babelfy code completely.

This setting is is only used for development and does not effect staging/production/testing builds which default to IE9. @See [https://github.com/babel/babel-preset-env](https://github.com/babel/babel-preset-env)

**Examples:**

```js
targets: { ie: 9 }
```

```js
targets: { browsers: ['last 2 Chrome versions'] }
```

```js
targets: { chrome: 57 }
```

#### `testing.browsers`
Arrya of browsers used when running Karma tests.  Default is `['Chrome']`;


#### `globals`
Create globals to be used for feature flags.  Globals must be defined in the workflow configuration file before they can be used as flags by a project.

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
- `__TEST__`: **true** when `process.env.NODE_ENV`  is **test**
- `__PROD__`: **true** when `process.env.NODE_ENV` is **production**
- `__STAGING__`: **true** when `process.env.NODE_ENV` is **staging**
- `process.env.NODE_ENV`: is `development`, `test`, `staging` or `production` accordingly.  

> `eslint-config-availity@2.1.0` or higher is needed for the default feature toggles to be recognized as valid globals by **eslint**.  

#### `ekko.enabled`
Enables or disables Ekko.  Default is `true`.

#### `ekko.port`
Ekko port number

#### `ekko.latency`
Sets default latency for all mock responses

#### `ekko.data`
Folder that contains the mock data files (json, images, etc).  Defaults to `project/data`.

#### `ekko.path`
Path to route configuration file used by Ekko to build Express routes.  Defaults to `project/config/routes.json`.

#### `ekko.plugins`
Array of NPM module names that enhance Ekko with additional data and routes. @See https://github.com/Availity/availity-mock-data

#### `ekko.pluginContext`
Pass URL context information to mock responses so that HATEOS links traverse correctly. Defaults to `http://localhost:{development.port}/api`

#### `proxies`
Array of proxy configurations.  A default configuration is enabled to proxy requests to the Ekko server.  Each proxy configuration can have the following attributes.  

- `context`: URL context used to match the activation of the proxy per request. 

**Ex:**:
```js
context: '/api'
```

- `target`: Host and port number for proxy. 
- `enabled`: Enables or disalbe a proxy configuration
- `pathRewrite`: _(Optional)_ Rewrites (using regex) the a path before sending request to proxy target.   

**Ex:**
```js
pathRewrite: {
  '^/api': ''
}
```

- `contextRewrite`: _(Optional)_ If `true`:
    - Rewrites the `Origin` and `Referer` headers from host to match the the proxy target url.
    - Rewrites the `Location` header from proxy to the host url.
    - Rewrites any urls of the response body (json only) to match the url of the host.  Only urls that match the proxy target are rewritten. This feature is useful if the proxy server sends back HATEOS links that need to work on the host.

- `headers`: _(Optional)_ Send default headers to the proxy destination. 

**Ex:**:
```js
headers: {
  RemoteUser: 'janedoe'
}
```

## Disclaimer

Open source software components distributed or made available in the Availity Materials are licensed to Company under the terms of the applicable open source license agreements, which may be found in text files included in the Availity Materials.

## License

Copyright (c) 2017 Availity, LLC. Code released under the [the MIT license](LICENSE)
