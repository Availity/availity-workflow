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
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
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
    "baseUrl": ".",
    "paths": {
      "@/*": ["./project/app/*"]
    }
  },
  "include": ["project/app"]
}
```

## Rename Files

Rename your source files from `.js`/`.jsx` to `.ts`/`.tsx`.

## Try it Out

Run `yarn start` — TypeScript errors will appear as overlay warnings in the browser during development, and will fail the build in production.
