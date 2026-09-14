---
title: 'Reference: Vite Workflow Configuration'
---

## Configuration

`@availity/workflow-vite` is configured via `project/config/workflow.js`. The file should use ESM syntax.

### Object Form

```js
/** @type {import('@availity/workflow-vite').WorkflowViteConfig} */
export default {
  development: {
    port: 3000,
    open: '/',
  },
  app: {
    title: 'My App',
  },
};
```

### Function Form

```js
/** @type {import('@availity/workflow-vite').WorkflowViteConfigFunction} */
export default (config) => {
  config.development.open = '/';
  return config;
};
```

## Options

### `development.open`

URL path to open in the default browser when the dev server starts. Default: `''` (disabled).

### `development.notification`

Enable build status system notifications. Default: `true`.

### `development.host`

Vite dev server host. Default: `'localhost'`.

### `development.port`

Vite dev server port. If unavailable, the next open port is used automatically. Default: `3000`.

### `development.sourceMap`

Enable source maps in development. Default: `true`.

### `development.babelInclude`

Additional `node_modules` packages to transform during testing. Default: `[]`.

### `development.vitestOverrides`

Vitest configuration overrides merged directly into the test config. Options are additive — you only need to specify what you want to change. See [Vitest config reference](https://vitest.dev/config/) for the full list.

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

> **Note on `clearMocks`:** Vitest 5 changed the default for `clearMocks` to `true`. `@availity/workflow-vite` explicitly pins it to `false` to preserve existing test behavior. To auto-clear mocks before each test, opt in via `vitestOverrides.clearMocks: true`.

```js
export default (config) => {
  config.development.vitestOverrides = {
    setupFiles: ['./vitest.setup.js'],
    coverage: {
      reporter: ['text', 'html'],
    },
  };
  return config;
};
```

### `app.title`

Page title for the generated HTML document. Default: `'Availity'`.

### `globals`

Global constants for feature flags. Values can be overridden via environment variables.

```js
export default {
  globals: {
    EXPERIMENTAL_FEATURE: false,
  },
};
```

Built-in globals:

- `__DEV__` — `true` when `NODE_ENV` is `development`
- `__TEST__` — `true` when `NODE_ENV` is `test`
- `__PROD__` — `true` when `NODE_ENV` is `production`
- `__STAGING__` — `true` when `NODE_ENV` is `staging`

### `ekko`

Mock server configuration (uses `@availity/mock-server` internally).

| Option          | Default                       | Description                |
| --------------- | ----------------------------- | -------------------------- |
| `enabled`       | `true`                        | Enable/disable mock server |
| `port`          | `9999`                        | Mock server port           |
| `latency`       | `250`                         | Response delay in ms       |
| `data`          | `project/data`                | Mock data folder           |
| `routes`        | `project/config/routes.json`  | Route config file          |
| `plugins`       | `['@availity/mock-data']`     | Mock data plugins          |
| `pluginContext` | `http://localhost:{port}/api` | Context for HATEOAS links  |

### `proxies`

Array of proxy configurations. Default proxies `/api`, `/ms`, and `/cloud` to the mock server.

```js
export default {
  proxies: [
    {
      context: ['/api', '/ms'],
      target: 'http://localhost:9999',
      enabled: true,
      logLevel: 'info',
      pathRewrite: { '^/api': '' },
      headers: { RemoteUser: 'jsmith' },
    },
  ],
};
```

### `eslint`

ESLint checker options for the Vite dev server.

| Option        | Default | Description                   |
| ------------- | ------- | ----------------------------- |
| `failOnError` | `true`  | Fail the build on lint errors |

### `modifyViteConfig`

Hook to customize the Vite configuration. Receives the resolved Vite config and workflow settings.

```js
export default (config) => {
  config.modifyViteConfig = (viteConfig, settings) => {
    // Example: add a custom alias
    viteConfig.resolve.alias['@utils'] = '/project/app/utils';
    return viteConfig;
  };
  return config;
};
```
