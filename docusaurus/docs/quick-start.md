---
title: Quick Start
---

## Create a New App

```bash
npx @availity/workflow init my-app
```

This scaffolds a React project with development server, mock API server, ESLint, Vitest, and a sample application.

> **Prefer Vite?** See the [Setting Up a Vite App](/recipes/vite) recipe to use `@availity/workflow-vite` instead.

## Start Developing

```bash
cd my-app
yarn start
```

The dev server starts at `http://localhost:3000` with hot module replacement. Changes inside `project/app/` reflect instantly in the browser.

## Run Tests

```bash
yarn test
```

## Lint

```bash
yarn lint
```

## Build for Production

```bash
yarn build
```

Outputs an optimized bundle to `./dist`, ready for deployment.
