---
title: Quick Start
---

## Create a new App using the Workflow CLI

```bash
npx @availity/workflow init workflow-app
```

## Change directories into the App Folder

```bash
cd ./workflow-app
```

## Start Development Enviornment

```bash
yarn start
```

Workflow will start a development environment avaiable at `http://localhost:3000`. Any changes inside the `project/app` directory will hot reload the application.

## Create a Production Deployment

The toolkit ships with several release tasks for building your bundle and updating the package version.

```bash
yarn production
```

This will bundle the app in the `./dist` directory and create a tag with the appropriate version. Push this to the server.

```bash
git push && git push --tags
```

> Note that in order to push the `./dist` folder up you will need to make sure the folder is not ignored inside of your `.gitignore` file.
