# @availity/workflow v14 Upgrade Guide

## What's New

- **Node 22+** — Node 20 reaches EOL October 2026. Workflow now requires Node 22 or later.
- **ESM** — all workflow packages are native ES modules.
- **Vitest** — replaces Jest as the default test runner. Tests use the same `describe`/`it`/`expect` API — most tests work without changes.
- **esbuild-loader** — replaces Babel for TypeScript/JSX compilation (faster builds).
- **ESLint 9 flat config** — `.eslintrc` is replaced by `eslint.config.js`.
- **Vite (opt-in)** — set `bundler: 'vite'` in your workflow config to use Vite for dev/build. Webpack remains the default bundler.

> **Important:** `@availity/workflow` v14 and `eslint-config-availity` (ESLint 9) must be upgraded together. They are not compatible with older versions of each other.

## Upgrade Steps

### 1. Ensure Node 22+

```bash
node -v  # must be 22.x or 24.x
```

### 2. Run the upgrade tool

```bash
npx @availity/workflow-upgrade@latest
```

This will:

- Update `@availity/workflow` and `eslint-config-availity` to the latest versions
- Remove deprecated devDependencies (Jest, Babel, old ESLint plugins)
- Migrate `.eslintrc.json` / `.eslintrc.yaml` → `eslint.config.js` (ESLint 9 flat config)
- Migrate `.eslintignore` patterns into the flat config
- Convert `project/config/workflow.js` from CommonJS to ESM
- Remove dead config keys (`jestOverrides` with unsupported fields, `eslint.configType`)
- Update `engines.node` in `package.json`
- Update `.node-version` / `.nvmrc` if pinned below Node 22
- Set `"type": "module"` in `package.json`
- Add Vitest type references to `tsconfig.json`

### 3. Test

```bash
yarn test
```

Vitest is API-compatible with Jest for the vast majority of tests. `describe`, `it`, `test`, `expect`, `vi.fn()`, `vi.mock()`, `vi.spyOn()` all work.

**Key differences from Jest:**

| Jest                        | Vitest                    | Notes                              |
| --------------------------- | ------------------------- | ---------------------------------- |
| `jest.fn()`                 | `vi.fn()`                 | Auto-imported with `globals: true` |
| `jest.mock('module')`       | `vi.mock('module')`       | Same hoisting behavior             |
| `jest.spyOn(obj, 'method')` | `vi.spyOn(obj, 'method')` | Identical API                      |
| `jest.useFakeTimers()`      | `vi.useFakeTimers()`      | Identical API                      |
| `jest-junit` reporter       | Built-in `junit` reporter | Configured by workflow             |

If your tests use `jest.*` directly, find-and-replace with `vi.*`:

```bash
# Preview changes
grep -r "jest\." project/__tests__/ --include="*.ts" --include="*.tsx"

# Replace (macOS)
find project/__tests__ -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/jest\./vi./g'
```

### 4. Lint

```bash
yarn lint
```

Run `yarn lint --fix` first, then review remaining errors.

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

### 7. CI/CD Reporters

If your CI used `jest-junit` for test reports, the Vitest `junit` reporter is configured automatically by workflow. Reports are written to the same location. Remove `jest-junit` from your devDependencies (the upgrade tool does this).

## Opting into Vite

Vite is available as an alternative bundler to Webpack. To opt in:

```js
export default (config) => {
  config.bundler = 'vite';

  // Modify Vite config if needed
  config.modifyViteConfig = (viteConfig, settings) => {
    return viteConfig;
  };

  return config;
};
```

## Breaking Changes

### Node 22+ Required

`engines.node` is `^22.0.0 || ^24.0.0`. Update CI pipelines and Docker images accordingly.

### Vitest Replaces Jest

Jest is no longer bundled. Remove these from your devDependencies (the upgrade tool handles this):

- `jest`, `jest-cli`, `jest-environment-jsdom`, `jest-transform-stub`
- `ts-jest`, `@types/jest`, `jest-junit`
- `react-test-renderer`

### Babel Removed

esbuild-loader replaces Babel for compilation. Remove these (handled by the upgrade tool):

- `@babel/core`, `@babel/preset-env`, `@babel/preset-react`, `@babel/preset-typescript`
- `babel-loader`, `babel-jest`, `babel-plugin-module-resolver`
- `@babel/runtime`, `@babel/plugin-*`

**`babelInclude` still works** — despite the name, this config key now controls which `node_modules` packages are compiled by esbuild-loader and included in Vitest's transform pipeline. Keep it if you need specific packages transpiled.

### ESLint 9 Flat Config

`.eslintrc.*` and `.eslintignore` are replaced by `eslint.config.js`. The upgrade tool handles this automatically.

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

### ESM Packages

`@availity/workflow` and `eslint-config-availity` are now `"type": "module"`. Your `project/config/workflow.js` is converted to ESM by the upgrade tool.

### Dead Config Keys Removed

The following workflow.js config keys are no longer functional and are removed by the upgrade tool:

| Key                                                 | Why                                                                                                                                                                 | Replacement                   |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `eslint.configType`                                 | Flat config is the only option                                                                                                                                      | None needed                   |
| `development.jestOverrides` (with unsupported keys) | Only `collectCoverageFrom`, `coveragePathIgnorePatterns`, and `testTimeout` are mapped to Vitest. Keys like `moduleNameMapper`, `transform`, `globals` are ignored. | `development.vitestOverrides` |

**Note:** `development.babelInclude` is still functional — it controls which `node_modules` packages are compiled by esbuild-loader (webpack) and transformed during tests (Vitest `deps.inline`). Keep it if your project depends on it.

### Polyfills Removed

The following polyfills have been removed:

| Package                     | Why it's no longer needed                                       |
| --------------------------- | --------------------------------------------------------------- |
| `react-app-polyfill/stable` | All supported browsers ship these features natively             |
| `navigator.sendbeacon`      | Supported in all major browsers since 2014–2017                 |
| `raf`                       | React 18+ doesn't require this for tests                        |
| `regenerator-runtime`       | Node 22+ and all supported browsers handle async/await natively |

## Upgrading from v13

If you're already on v13, the upgrade tool handles the transition automatically. Key changes from v13→v14:

1. Node 20 → Node 22 minimum
2. Jest (default) → Vitest (default)
3. Babel → esbuild-loader
4. `jestOverrides` → `vitestOverrides`
5. `babelInclude` → removed (not needed)

The `eslint.config.js` and ESM conversion from v13 are preserved — the tool skips those steps if already done.

## Troubleshooting

**`ERR_REQUIRE_ASYNC_MODULE`** — You are mixing incompatible versions of `eslint-config-availity` and `@availity/workflow`. Both must be upgraded together.

**`jest is not defined` in tests** — Replace `jest.fn()` with `vi.fn()`, `jest.mock()` with `vi.mock()`, etc. Vitest globals are enabled but use the `vi` namespace.

**`Cannot find module` in tests** — If you had `moduleNameMapper` in `jestOverrides`, migrate them to `vitestOverrides` using Vitest's `resolve.alias` format, or use `babelInclude` to ensure the packages are transformed.

**`babelInclude` warning** — Despite the name, this config key is still functional in v14. It controls which `node_modules` packages get compiled. You don't need to remove it.
