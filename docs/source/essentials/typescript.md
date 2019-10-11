---
title: Adding Typescript
summary: Step by step for adding typescript to workflow.
---

> Supported versions `7>=`

Adding in [Typescript](https://www.typescriptlang.org/) to an existing project is close to the same as [create-react-app](https://create-react-app.dev/docs/adding-typescript).

```shell hideCopy=true
npm install --save typescript @types/node @types/react @types/react-dom @types/jest

# or 

yarn add typescript @types/node @types/react @types/react-dom @types/jest
```

Once installed, all files need to be renamed from `.js/.jsx` to `.tsx`.


## Tsconfig File

Also noted on the previous section. We use the tsconfig for vscode to let us intellisense the root imports and in this case also experimental decorators.

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./project/app/*"]
    }
  }
}
```
