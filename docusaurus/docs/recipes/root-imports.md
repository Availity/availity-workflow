---
title: Configuring Root Imports
---

Root imports let you use `@/` as an alias for `project/app/`, avoiding deeply nested relative paths.

## Example

```jsx
import Form from '@/components/Form';
```

Instead of:

```jsx
import Form from '../../../components/Form';
```

## How It Works

- **Webpack workflow** (`@availity/workflow`): Uses `babel-plugin-root-import` which is preconfigured.
- **Vite workflow** (`@availity/workflow-vite`): Uses Vite's `resolve.alias` which is preconfigured.

Both resolve `@/` to `project/app/` by default.

## ESLint Configuration

The `eslint-config-availity` package includes resolver support for root imports. Ensure you have the latest version:

```bash
yarn add eslint-config-availity@latest --dev
```

## TypeScript / Editor Support

For VS Code IntelliSense and TypeScript resolution, add `paths` to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./project/app/*"]
    }
  }
}
```

This enables ctrl+click navigation and autocomplete for root imports in VS Code.
