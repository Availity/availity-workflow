---
title: ESLint Configuration
---

`@availity/workflow` projects use [eslint-config-availity](https://github.com/Availity/eslint-config-availity) with ESLint's flat config format.

## Setup

Install the config:

```bash
yarn add eslint-config-availity --dev
```

Create `eslint.config.js` at your project root:

```js
import workflow from 'eslint-config-availity/workflow';

export default [
  ...workflow,
  {
    ignores: ['**/coverage/', '**/build/', '**/dist/'],
  },
];
```

## With TypeScript

If your project uses TypeScript, add the import resolver:

```js
import workflow from 'eslint-config-availity/workflow';

export default [
  ...workflow,
  {
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
  },
  {
    ignores: ['**/coverage/', '**/build/', '**/dist/'],
  },
];
```

## Running

```bash
av lint
```

Or directly:

```bash
npx eslint .
```

## Migrating from `.eslintrc`

If you're upgrading from an older project using `.eslintrc.yml` or `.eslintrc.json`:

1. Delete the old config file (`.eslintrc.yml`, `.eslintrc.json`, or `.eslintrc.js`)
2. Create `eslint.config.js` as shown above
3. Remove any individual ESLint plugins from `devDependencies` — they're bundled in `eslint-config-availity`:
   - `eslint-plugin-import`
   - `eslint-plugin-jsx-a11y`
   - `eslint-plugin-react`
   - `@typescript-eslint/eslint-plugin`
   - `@typescript-eslint/parser`

The `@availity/workflow-upgrade` tool can automate this migration:

```bash
npx @availity/workflow-upgrade
```
