# Contributing

This is a monorepo managed using [`yarn berry` workspaces](https://yarnpkg.com/features/workspaces) and [Nx](https://nx.dev/) for task orchestration. Each package is versioned and published individually.

## Prerequisites

- **Node.js** ≥ 22.12.0 (see `.nvmrc`)
- **Yarn** 4.x — managed via the `packageManager` field in `package.json`. Enable it with [Corepack](https://nodejs.org/api/corepack.html):

  ```bash
  corepack enable
  ```

  You do not need to install Yarn globally via npm.

## Installing

Clone or fork the repository, then install all dependencies from the repo root:

```bash
yarn install
```

## Packages

The monorepo contains the following packages under `./packages/`:

| Package                      | Description                                             |
| ---------------------------- | ------------------------------------------------------- |
| `@availity/workflow`         | Webpack-based build toolkit                             |
| `@availity/workflow-vite`    | Vite-based build toolkit (recommended for new projects) |
| `@availity/workflow-logger`  | Shared logger                                           |
| `@availity/workflow-upgrade` | Upgrade CLI                                             |
| `@availity/mock-server`      | Local mock server                                       |
| `@availity/mock-data`        | Mock data for development                               |

When adding a new package, also add a link to it in the root `README.md`.

## Testing Your Changes

Several scripts are available for validating changes. In VS Code, these can also be run via the integrated debugger.

### Unit Tests

```bash
# Run all unit tests
yarn test

# Run only tests affected by your changes (via Nx)
yarn test:affected
```

### Example Apps

```bash
# Run the Webpack example app
yarn start:app

# Run the Vite example app
yarn start:vite-app

# Test the Webpack example app
yarn test:app

# Test the Vite example app
yarn test:vite-app

# Build the Webpack example app
yarn build:app

# Build the Vite example app
yarn build:vite-app
```

### Integration Tests

```bash
# Runs the build and test targets for every workspace
yarn test:integration
```

### Testing Template Changes

If you need to test changes to a project template, use the `--branchOverride` flag when initializing:

```bash
npx @availity/workflow init <your-project-name> --branchOverride <your-branch>
```

### Linting

```bash
# Lint files affected by your changes
yarn lint

# Lint all files
yarn lint:all

# Auto-fix lint issues in affected files
yarn lint:fix
```

## Commits

Commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) format (enforced via `commitlint`).

The project uses `@commitlint/config-nx-scopes`, so valid scopes are derived from the Nx project names:

- `workflow`
- `workflow-vite`
- `workflow-logger`
- `workflow-upgrade`
- `mock-server`
- `mock-data`

**Examples:**

```
feat(workflow): add support for custom PostCSS config
fix(workflow-vite): resolve HMR issue with SASS modules
chore: update dependencies
```

- Use `BREAKING CHANGE:` in the commit footer for breaking changes.
- If a commit applies to multiple packages, omit the scope.
- When in doubt, ask the PR reviewers — they'll help with commit messages and versioning.

## Versioning

This repo uses [`@jscutlery/semver`](https://github.com/jscutlery/semver) with Nx to manage versions and changelogs. Versioning happens automatically on merge to `master` based on conventional commit messages.

To do a dry run of the version bump locally:

```bash
yarn version:dry-run
```

General version bump rules:

| Commit type               | Version bump |
| ------------------------- | ------------ |
| `feat`                    | Minor        |
| `fix`, `refactor`, `perf` | Patch        |
| `BREAKING CHANGE` footer  | Major        |

When in doubt, ask the PR reviewers for help determining the right version bump.

## Contributor Workflow

1. **Members of the Availity org:** Clone the repo and create a branch off `master`.
   **External contributors:** Fork the repo and create a branch off `master`.

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Make your changes.

4. Add or update tests as needed and make sure they pass:

   ```bash
   yarn test
   ```

5. Ensure linting passes:

   ```bash
   yarn lint
   ```

6. Commit your changes following the [Conventional Commits](https://www.conventionalcommits.org/) format.

7. Push your branch and open a pull request against `master`.

8. On merge to `master`, changelogs are automatically generated, and new package versions are tagged and published.
