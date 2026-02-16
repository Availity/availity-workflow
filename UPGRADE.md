# @availity/workflow v13 Upgrade Guide

## What's New

- **Node 20+** — Node 18 reached EOL April 2025. Workflow now requires Node 20 or later.
- **ESM** — all workflow packages are native ES modules.
- **ESLint 9 flat config** — `.eslintrc` is replaced by `eslint.config.js`.
- **Jest 30** — upgraded from Jest 27 with improved performance. `jest-environment-jsdom` is now bundled — remove it from your devDependencies if present.
- **Vite + Vitest (opt-in)** — set `bundler: 'vite'` in your workflow config to use Vite for dev/build and Vitest for tests. Webpack + Jest remain the default.

> **Important:** `@availity/workflow` v13 and `eslint-config-availity` (ESLint 9) must be upgraded together. They are not compatible with older versions of each other.

## Upgrade Steps

### 1. Ensure Node 20+

```bash
node -v  # must be 20.x, 22.x, or 24.x
```

### 2. Run the upgrade tool

```bash
npx @availity/workflow-upgrade@latest
```

This will:

- Update `@availity/workflow` and `eslint-config-availity` to the latest versions
- Remove deprecated devDependencies that are now bundled
- Migrate `.eslintrc.json` / `.eslintrc.yaml` → `eslint.config.js` (ESLint 9 flat config)
- Migrate `.eslintignore` patterns into the flat config
- Update `engines.node` in `package.json`
- Update `.node-version` / `.nvmrc` if pinned below Node 20

### 3. Lint

```bash
yarn lint
```

The new ESLint config ships sensible defaults — most opinionated style rules are off or warn. Run `yarn lint --fix` first, then review remaining errors.

Project-specific rule overrides are preserved in your new `eslint.config.js`.

### 4. Test

```bash
yarn test
```

Jest 30 is backward-compatible with most Jest 27 tests. If you had `jest-environment-jsdom` in your devDependencies, you can remove it — workflow provides it now.

### 5. Build

```bash
yarn build
```

### 6. Dockerfiles (if applicable)

The upgrade tool does not modify Dockerfiles. Update Node base images manually:

```diff
- FROM availity-docker-shared.${ARTIFACTORY_DOMAIN}/docker/availity-node20:0.0.11 as base
+ FROM availity-docker-shared.${ARTIFACTORY_DOMAIN}/docker/availity-node22:0.2.0 as base
```

## Opting into Vite + Vitest

Vite and Vitest are available as an alternative to Webpack and Jest. To opt in, set `bundler: 'vite'` in your `project/config/workflow.js`:

```js
module.exports = (config) => {
  config.bundler = 'vite';
  // testRunner is automatically set to 'vitest' when bundler is 'vite'

  // Modify Vite config if needed (equivalent to modifyWebpackConfig)
  config.modifyViteConfig = (viteConfig, settings) => {
    return viteConfig;
  };

  return config;
};
```

## Breaking Changes

### Node 20+ Required

`engines.node` is `^20.0.0 || ^22.0.0 || ^24.0.0`. Update CI pipelines and Docker images accordingly.

### ESLint 9 Flat Config

`.eslintrc.*` and `.eslintignore` are replaced by `eslint.config.js`. The upgrade tool handles this automatically. If you have a custom `.eslintrc.js`, migrate manually:

**Before:**
```yaml
# .eslintrc.yaml
extends: availity/workflow
rules:
  no-console: warn
```

**After:**
```js
// eslint.config.js
import workflow from 'eslint-config-availity/workflow';

export default [
  ...workflow,
  {
    rules: {
      'no-console': 'warn',
    },
  },
];
```

See the [eslint-config-availity README](https://github.com/Availity/eslint-config-availity) for full details.

### Polyfills Removed

The following polyfills have been removed from the webpack entry point and jest setup:

| Package | What it polyfilled | Why it's no longer needed |
|---|---|---|
| `react-app-polyfill/stable` | `Promise`, `Object.assign`, `Symbol`, `Array.from`, `fetch`, etc. via core-js | All supported browsers (Chrome, Firefox, Safari, Edge) have shipped these features natively for years. IE11 is no longer supported. |
| `navigator.sendbeacon` | `navigator.sendBeacon()` | Supported in all major browsers since 2014–2017. |
| `raf` | `requestAnimationFrame` (jest setup) | React 18+ no longer requires this polyfill for tests. Available in jsdom and all browsers. |
| `regenerator-runtime` | `async`/`await`, generators | Node 20+ and all supported browsers handle async/await natively. Babel no longer needs to transpile these. |

If your application targets unusual environments that still need polyfills, add `core-js` directly to your project as a dependency.

### ESM Packages

`@availity/workflow` and `eslint-config-availity` are now `"type": "module"`. Your `project/config/workflow.js` can remain CommonJS — workflow loads it with `createRequire`.

## Troubleshooting

**`ERR_REQUIRE_ASYNC_MODULE`** — You are mixing incompatible versions of `eslint-config-availity` and `@availity/workflow`. Both must be upgraded together.

**`useEslintrc` unknown option** — Same cause as above.

**Many lint errors after upgrade** — Run `yarn lint --fix` first. Remaining errors are genuine. Disable noisy rules in your `eslint.config.js` if needed.
