---
title: Getting Started
---

import useBaseUrl from '@docusaurus/useBaseUrl';

## Prerequisites

Throughout the documentation you will see [yarn](https://yarnpkg.com/) used. You are not required to use this however it is our package manager of choice. If you are still wanting to use npm then just note the subtle differences in the commands. `yarn start` would be the same `npm start`.

The minimum required [Nodejs](https://nodejs.org/) version to run and use our toolkit is `v18.0.0`, but using `v20.0.0` or higher is recommended.

## Creating a new App Using the Workflow CLI

Our toolkit has a built in CLI that will allow you to run multiple commands like you would with any other react project. In addition to the default commands you would see like `start`, `test`, `build` we have an `init` command that will initialize a new project using a [specified default template](/reference/commands/#availity-templates).

You can run the below command to get started:

```bash
npx @availity/workflow init workflow-app
```

What the above command is doing is using [npx](https://www.npmjs.com/package/npx) to download and execute the script without you having a pre-existing `package.json`. The `init` command is the command we send to our package `@availity/workflow`. The last argument, `workflow-app` is the project name that we gave.

Once the CLI finishes initializing the project we can `cd` into the directory with the below command:

```bash
cd ./workflow-app
```

Go ahead and start the application by running the below command:

```bash
yarn start
```

## Project Structure

Next let's open the project in any one of your favorite editors so we can review the project structure.

<img width="100%" src={useBaseUrl('img/project-structure.png')} alt="Project Structure" />

> Our editor of choice is [Visual Studio Code](https://code.visualstudio.com/) and the above screen shot is depicting what it would look like in here.

### Application Code

All of our application logic is stored in the `project/app` folder. We can see the `index.js` is the main entry point.

Making any change to the files inside of `project/app` will automatically hot-reload the web page, given some small edge cases.

<img width="100%"src={useBaseUrl('img/project-change.gif')} alt="Project Change Example" />

We recommend you explore the coding styles and libraries we chose in this starter toolkit before deleting as it has some good practices to follow when developing web applications.

### Exploring workflow.js

Inside of the `config` folder there is a file titled `workflow.js`. You can use this file to provide any overrides to the webpack configuration, development dependencies as well as additional proxy configurations you may want.

Let's open the current file and see what we got.

```js header=workflow.js
export default (config) => {
    config.development.open = '#/?spaceId=48C607A70B5A46A3864A34E2BDDDEA04';

    config.development.hotLoader = true;

    return config;
};
```

The workflow file takes in a `config` object which contains all of the webpack configurations, babel presets and more. We specify the webpack development server to open the application with a path of `#/?spaceId=48C607A70B5A46A3864A34E2BDDDEA04` once it has compiled.

```bash hideCopy=true
config.development.open = '#/?spaceId=48C607A70B5A46A3864A34E2BDDDEA04';
```

Wait, but what is a `spaceId`? We will get into that later but if you want you can skip ahead to `here`.

Next we have some overrides to the `hotLoader` that will hot reload our app. The experimental flag is enabled so that we can leverage a new feature that the [React Core Team](https://reactjs.org/community/team.html) is working on but is not yet feature complete.

```js hideCopy=true
config.development.hotLoader = {
    enabled: true,
    experimental: true
};
```

Lastly we have to return the `config` for the rest of the build process to take advantage of the overrides we gave it.

By now you should have a general grasp on the project strcuture for developing and making changes to your application. Next we will talk about getting data into your application.
