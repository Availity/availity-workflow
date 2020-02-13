---
title: Adding Typescript Support
summary: Step by step for adding typescript to workflow.
---

> Note that the below recipe only works in Workflow Versions `>=7.0.0`

Adding in [Typescript](https://www.typescriptlang.org/) to an existing project is close to the same as [create-react-app](https://create-react-app.dev/docs/adding-typescript).

## Install Dependencies

```bash
yarn add typescript @types/node @types/react @types/react-dom @types/jest --dev
```

Once installed, all files need to be renamed from `.js/.jsx` to `.tsx`.

## Adding the TsConfig

Also noted on the previous section. We use the tsconfig for vscode to let us intellisense the root imports and in this case also experimental decorators. Add the below file to the root of you project workspace.

```json header=tsconfig.json
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

## Try it Out
