# @availity/workflow-vite

> Vite-based build toolkit for Availity web projects.

[![](https://img.shields.io/npm/v/@availity/workflow-vite.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@availity/workflow-vite)

## Installation

```bash
npm install @availity/workflow-vite --save-dev
```

Requires Node.js `^22.0.0 || ^24.0.0`. This package is ESM only.

## Getting Started

Scaffold a new project:

```bash
npx @availity/workflow init <your-project-name>
```

Or add to an existing project by installing the package and adding scripts to `package.json`:

```json
{
  "scripts": {
    "start": "av start",
    "build": "av build",
    "test": "av test",
    "lint": "av lint"
  }
}
```

## CLI Commands

| Command   | Description                          |
| --------- | ------------------------------------ |
| `start`   | Start dev server with HMR            |
| `build`   | Production build                     |
| `test`    | Run tests via Vitest                 |
| `lint`    | Lint with ESLint                     |
| `release` | Build and prepare for release        |
| `profile` | Analyze bundle                       |
| `about`   | Display environment info             |
| `version` | Print version                        |

## Configuration

Create `project/config/workflow.js`:

```js
export default {
  development: {
    host: 'localhost',
    port: 3000,
    open: '/',
    sourceMap: true,
    notification: true,
  },
  app: {
    title: 'My App',
  },
  ekko: {
    enabled: true,
    latency: 300,
    port: 9999,
    data: 'project/data',
    routes: 'project/config/routes.json',
  },
  proxies: [
    {
      context: '/api',
      target: 'http://localhost:9999',
      enabled: true,
      pathRewrite: { '^/api': '' },
    },
  ],
};
```

### Key Options

- **`development.vitestOverrides`** — Override any [Vitest config](https://vitest.dev/config/) option.
- **`development.babelInclude`** — Additional `node_modules` packages to transform during testing.
- **`globals`** — Feature flag constants (`__DEV__`, `__TEST__`, `__PROD__`, `__STAGING__`).
- **`eslint.failOnError`** — Fail the build on lint errors.

## TypeScript Support

Get IntelliSense in `workflow.js` with JSDoc annotations:

```js
/** @type {import('@availity/workflow-vite').WorkflowViteConfig} */
export default {
  development: {
    port: 3000,
  },
  app: {
    title: 'My App',
  },
};
```

## Customizing Vite Config

Use `modifyViteConfig` to extend or override the internal Vite configuration:

```js
/** @type {import('@availity/workflow-vite').WorkflowViteConfig} */
export default {
  modifyViteConfig: (viteConfig, settings) => {
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      '~': new URL('./src', import.meta.url).pathname,
    };
    return viteConfig;
  },
};
```

## License

[MIT](../../LICENSE)
