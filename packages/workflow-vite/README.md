# @availity/workflow-vite

> Vite-based build toolkit for Availity web projects.

[![](https://img.shields.io/npm/v/@availity/workflow-vite.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@availity/workflow-vite)

## Installation

```bash
npm install @availity/workflow-vite --save-dev
```

Requires Node.js `>=22.12.0`. This package is ESM only.

## Getting Started

Scaffold a new project using the Vite + TypeScript starter template:

```bash
npx @availity/workflow init <your-project-name> --template https://github.com/Availity/availity-starter-vite-typescript
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

| Command   | Description                   |
| --------- | ----------------------------- |
| `start`   | Start dev server with HMR     |
| `build`   | Production build              |
| `test`    | Run tests via Vitest          |
| `lint`    | Lint with ESLint              |
| `release` | Build and prepare for release |
| `profile` | Analyze bundle                |
| `about`   | Display environment info      |
| `version` | Print version                 |

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
  - **`vitestOverrides.inlineDeps`** — Additional `node_modules` packages to inline-transform via Vite during testing (maps to `server.deps.inline`).
  - **`vitestOverrides.resolveConditions`** — Override Vite resolve conditions for the test run (see below).
  - **`vitestOverrides.clearMocks`** — Set to `true` to opt into Vitest 5's default behavior (auto-clear mock call history before each test, leaving implementations intact). Defaults to `false` to preserve pre-Vitest-5 behavior.
- **`development.resolveConditions`** — Override the Vite resolve conditions used during testing. Defaults to `['browser', 'module', 'import', 'default']`, which intentionally excludes the Node 22 `module-sync` condition to prevent `vmThreads` failures on Linux. Only set this if you have specific needs.
- **`development.babelInclude`** — ⚠️ **Deprecated.** Use `development.vitestOverrides.inlineDeps` instead. (The name is a webpack-era holdover — Vite does not use Babel for this.)
- **`development.jestOverrides`** — ⚠️ **Deprecated.** Use `development.vitestOverrides` instead. Supports a limited backward-compatible subset: `collectCoverageFrom`, `coveragePathIgnorePatterns`, `testTimeout`.
- **`globals`** — Feature flag constants (`__DEV__`, `__TEST__`, `__PROD__`, `__STAGING__`).
- **`eslint.failOnError`** — Fail the build on lint errors.

## Troubleshooting

### `SyntaxError: Cannot use import statement outside a module` on Node 22 + Linux

**Root cause:** Node 22 introduced the `module-sync` export condition for synchronous ESM loading in CJS contexts. When Vitest runs with the `vmThreads` pool on Linux + Node 22, it can resolve `module-sync` → a `.mjs` file, then try to `require()` it — producing this error. This does not reproduce on macOS.

**Built-in fix:** `workflow-vite` already works around this by excluding `module-sync` from `resolve.conditions`, forcing the `import` or `default` condition instead.

If you encounter a similar issue with a different package, add it to your inline list:

```js
/** @type {import('@availity/workflow-vite').WorkflowViteConfig} */
export default {
  development: {
    vitestOverrides: {
      inlineDeps: ['some-problematic-package'],
    },
  },
};
```

Or override the full resolve conditions list:

```js
export default {
  development: {
    resolveConditions: ['browser', 'module', 'import', 'default'],
  },
};
```

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
