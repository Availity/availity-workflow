# CLI

## NPM
> NPM requiries a `--` between the command and options
```bash
npm run <command> -- <options>
```

## Commands

### `help`
Show help menu for all CLI options.

### `start`
Start the development server and watches for file changes.  Hot-reloading is enabled for React projects.  Angular projects hot reload CSS only.

#### options

##### `--dry-run`
Start the development server using prouction settings. Example:

`npm start -- --dry-run`

### `lint`
Lint project files using EsLint.

#### options

##### `--include`
Include additional glob patterns for linting.

### `release`
- Prompts the user for a version
- Cleans up `/dist` folder
- Bundles project assets into the `/dist` folder
- Tags the version in Git

#### NODE_ENV

##### `production`
Minfies the javascript assets.

##### `staging`
No minification is done on javascript assets

#### options

##### `--dry-run`

### `test`
Run the tests for your project.  The behavior of the test are determined by the plugin used in the workflow engine.  The engine supports `availity-workflow-react` (Jest) and `availity-workflow-angular` (Karma and Phantomjs) plugins.

### `about`
Awesomeness.





