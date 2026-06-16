---
title: Setting Up a Vite App
---

`@availity/workflow-vite` provides a Vite-based alternative to the Webpack workflow. It uses Vite for development and builds, and Vitest for testing.

## New Project

Scaffold a new project with the Vite template:

```bash
npx @availity/workflow init my-app --template https://github.com/Availity/availity-starter-typescript
```

Then swap the workflow dependency:

```bash
yarn remove @availity/workflow
yarn add @availity/workflow-vite --dev
```

## Migrating an Existing Project

1. **Swap the dependency:**

   ```bash
   yarn remove @availity/workflow
   yarn add @availity/workflow-vite --dev
   ```

2. **Update `project/config/workflow.js`** (if you have one):

   ```js
   /** @type {import('@availity/workflow-vite').WorkflowViteConfig} */
   export default {
     development: {
       port: 3000,
     },
   };
   ```

   Or use the function form:

   ```js
   /** @type {import('@availity/workflow-vite').WorkflowViteConfigFunction} */
   export default (config) => {
     config.development.open = '/';
     return config;
   };
   ```

3. **Add `index.html`** to `project/app/`:

   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>My App</title>
     </head>
     <body>
       <div id="app"></div>
       <script type="module" src="./index.tsx"></script>
     </body>
   </html>
   ```

4. **Rename test files** if needed. Vitest is compatible with Jest syntax, but uses ESM imports:

   ```js
   import { describe, it, expect } from 'vitest';
   ```

## Customizing Vite Config

Use `modifyViteConfig` in your workflow.js to add plugins or adjust settings:

```js
export default (config) => {
  config.modifyViteConfig = (viteConfig, settings) => {
    // Add a custom plugin
    viteConfig.plugins.push(myPlugin());
    return viteConfig;
  };
  return config;
};
```

## Key Differences from Webpack Workflow

| Feature         | Webpack (`@availity/workflow`) | Vite (`@availity/workflow-vite`)        |
| --------------- | ------------------------------ | --------------------------------------- |
| Dev server      | webpack-dev-server             | Vite dev server (ESM-based, faster HMR) |
| Build           | Webpack 5                      | Rollup (via Vite)                       |
| Test runner     | Vitest                         | Vitest                                  |
| Config hook     | `modifyWebpackConfig`          | `modifyViteConfig`                      |
| Hot reload      | react-refresh-webpack-plugin   | @vitejs/plugin-react                    |
| Bundle analysis | `av profile`                   | `rollup-plugin-visualizer` (built-in)   |

## Commands

All CLI commands are the same: `av start`, `av build`, `av test`, `av lint`, `av release`.
