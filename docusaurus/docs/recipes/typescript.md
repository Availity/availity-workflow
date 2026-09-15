---
title: Adding TypeScript Support
---

Both `@availity/workflow` and `@availity/workflow-vite` support TypeScript out of the box.

## Install Dependencies

```bash
yarn add typescript @types/node @types/react @types/react-dom --dev
```

## Add tsconfig.json

Create a `tsconfig.json` at the root of your project:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./project/app/*"]
    }
  },
  "include": ["project/app"]
}
```

:::note TypeScript 6
If you are using TypeScript 6 or later, `baseUrl` has been deprecated. Use `paths` with entries relative to the `tsconfig.json` location instead, as shown above.

For TypeScript 5, the above config works as-is. No `baseUrl` is needed.
:::

## Rename Files

Rename your source files from `.js`/`.jsx` to `.ts`/`.tsx`.

## Enable Type Checking During Development (Vite only)

By default, Vite strips TypeScript types without checking them — this keeps the dev server and builds fast. If you want type errors to surface during development and fail production builds, opt in via `project/config/workflow.js`:

```js
/** @type {import('@availity/workflow-vite').WorkflowViteConfig} */
export default {
  development: {
    typeCheck: true,
  },
};
```

When enabled, `tsc --noEmit` runs in a worker thread alongside Vite so it does not block Hot Module Replacement (HMR). Type errors appear in the terminal and will fail `yarn build`.

:::tip
This is a good option for teams who want consistent type enforcement across local development and CI without maintaining a separate `tsc --noEmit` step.
:::

## TypeScript Version Support

`@availity/workflow-vite` supports TypeScript `^5.0.0 || ^6.0.0`. The version installed in your project is the one used for type checking — there is nothing extra to configure.
