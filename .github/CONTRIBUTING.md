# Contributing

This is a monorepo managed using [`yarn berry` workspaces](https://yarnpkg.com/features/workspaces). Each package is versioned and published individually.

## Adding a New Package

-   ```bash
    yarn run new
    ```

-   Add link to new package in README

## Installing

We use [yarn](https://yarnpkg.com/lang/en/) workspaces for developing. If you don't have [yarn](https://yarnpkg.com/lang/en/) you can install it by running
`npm install -g yarn`. Otherwise you can run the below to install all the dependencies.

```bash
yarn install
```

Although we are not yet using [Plug'n'Play](https://yarnpkg.com/features/pnp) all subsequent installs should be quick after the first initial one.

## Commits

Once satisfied with your changes, you will need to commit them.

-   Commits should use the [Angular Commit Format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#type).
-   Scope should be one of the un-prefixed name of the packages under `./packages/`, for example, `feat(workflow): msg` would apply to the `@availity/workflow` package.
-   If a commit applies to multiple packages, leave out the scope.
-   Using conventional commits will help you to determine the appropriate version bump during the versioning process, so following the [Angular Commit Format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#type) is important! When in doubt, don't hesitate to reach out to the reviewers of your PR for help with commit messages and versioning.

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

### Testing Template Changes

If you need to test changes to the template, you can use the `--branchOverride` command when running `npx @availity/workflow init`.

## Versioning

This repo uses the [yarn release workflow](https://yarnpkg.com/features/release-workflow) for managing versions and releases. We expect you to follow the [Angular Commit Format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#type) since it will help when determining an appropriate version bump for your PR.

-   Once your changes have been committed and tested, it's time to create a release definition file
-   Run

    ```bash
     yarn version check --interactive
    ```

    to see a summary of all your changed files, changed workspaces, and dependent workspaces. You will also see checkboxes for each entry, allowing you to pick the release strategy that's appropriate for each workspace.

    This can be tricky sometimes, but your commit messages will help out here. In general, the following is a guide for selecting version bump levels:

    -   Major: Any workspace with a commit containing `BREAKING CHANGES:` should receive a major version bump, regardless of commit type. Any dependent workspaces should also receive a major bump.

    -   Minor: Any workspace with a commit type of `feat`. Any dependent workspaces can receive a patch version bump.

    -   Patch: Any workspace with a commit type of `fix, refactor, perf`. Any dependent workspaces can receive a patch version bump.

-   When in doubt, don't hesitate to reach out to the reviewers of your PR for help determining the right version strategy.

## Contributor Workflow

-   `git clone` this repo if you are a member of the Availity organization, otherwise `git fork` it

-   Make and commit any changes, being sure to follow the [Angular Commit Format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#type)

-   Create or update any necessary tests and run them

-   Version your changes and commit them

-   `git push` those changes to your PR

-   Upon merge to `master`, changelogs will be automatically generated, and your versions will be tagged and published without requiring any further action
