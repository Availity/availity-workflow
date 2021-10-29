# Contributing

This is a monorepo managed using [`yarn berry` workspaces](https://yarnpkg.com/features/workspaces). Each package is versioned and published individually.

## Adding a New Package

1.

```bash
 yarn run new
```

2. Add link to new package in README

## Installing

We use [yarn](https://yarnpkg.com/lang/en/) workspaces for developing. If you don't have [yarn](https://yarnpkg.com/lang/en/) you can install it by running
`npm install -g yarn`. Otherwise you can run the below to install all the dependencies.

```bash
yarn install
```

Although we are not yet using [Plug'n'Play](https://yarnpkg.com/features/pnp) all subsequent installs should be quick after the first initial one.

## Testing Changes

There are a few scripts you can use for testing changes. If you are using `vscode` you will be able to run them from the debugger, otherwise they can be run from your CLI.

### `yarn start:app`

Runs the example application

### `yarn test:app`

Tests the example application

### `yarn test:integration`

Runs the integration command on each workspace in this repo. Generally, it will build and test each workspace.

### `yarn build:app`

Builds the example application

### Commits

Commits should use the [Angular Commit Format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#type). Scope should be one of the un-prefixed name of the packages under `./packages/`, for example, `feat(workflow): msg` would apply to the `@availity/workflow` package. If a commit applies to multiple packages, leave out the scope.

### Versioning

This repo uses [monodeploy](https://tophat.github.io/monodeploy/) for managing versions and releases. It is similar to `lerna`, but is built to leverage `berry` workspaces. We use conventional commits to automatically determine semantic version bumps when releasing packages, so following the [Angular Commit Format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#type) is important! When in doubt, don't hesitate to reach out to the reviewers of your PR for help with commit messages.

### Contributor Workflow

-   `git clone` this repo if you are a member of the Availity organization, otherwise `git fork` it

-   Make and commit any changes, being sure to follow the [Angular Commit Format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#type)

-   `git push` those changes to your PR

-   Upon merge to `master`, changelogs will be automatically generated, and your versions will be tagged and published without requiring any further action
