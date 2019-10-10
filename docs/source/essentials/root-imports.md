---
title: Root Imports
---
> Supported versions `7>=`

By default we include `babel-plugin-import` which allows you to import components using a specific syntax if you have a tree structure that goes past 2 - 3 layers.

Using the `@/` key we can alias anything from the root of `project/app` inside of our project. We include the eslint config, and tsconfig so that if you are using vscode you will get all the intellisense for free.

## Example

In the below example, we are

```jsx hideCopy=true
import React from 'react';
import Form from '@/components/Form';

<Form>{/* Stuff */}</Form>;
```

## Eslint Config

Make sure you have the latest `eslint-config-availity` installed.
```bash
yarn add eslint-config-availity@latest --dev
```

```yaml header=.eslintrc.yml
extends: availity/workflow
```

## TsConfig For Visual Studio Code

If you want intellisense in vscode to pick up the root imports and allow you to control click into components you will need to make sure your `tsconfig.json` is updated. We have pasted ours below that we use in our starter projects.

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

## References

- [babel-plugin-root-import](https://www.npmjs.com/package/babel-plugin-root-import)
- [eslint-root-import-resolver](https://www.npmjs.com/package/eslint-import-resolver-babel-plugin-root-import)
