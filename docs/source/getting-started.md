---
title: Getting Started
summary: Bootstrap your starter apps with the below configurations.
---

## React

```bash
npx @availity/workflow init <your-project-name>
```

<small>Note: `<your-project-name>` is the name of your project following the npm package naming standard</small>

#### Availity Templates

-   [React Starter](https://github.com/Availity/availity-starter-react)
-   [Complex Starter (React)](https://github.com/Availity/availity-starter-complex)
-   [Wizard Starter (React)](https://github.com/Availity/availity-starter-wizard)
-   [Typescript Starter](https://github.com/Availity/availity-starter-typescript)

## Commands

### `help`

Show help menu for all CLI options.

### `init <projectName>`

#### Positionals

`projectName` Required. The name of the project you want to create.

#### Options

-   `--version`, `-v`: Specify which version of the project you want. [default: "latest"]
-   `--current-dir`, `-c`: If you want the project to be created in the current directory
-   `--template`, `-t`: The template you want to initialize the projec with

#### Examples

-   `npx @availity/workflow init my-package-name`
-   `npx @availity/workflow init my-package-name --template https://github.com/Availity/availity-starter-angular`
-   `npx @availity/workflow init my-package-name --version 4.0.0-alpha.4`

### `start`

Start the development server and watches for file changes. Hot-reloading is enabled for React projects. Angular projects hot reload CSS only.

#### options

##### `--dry-run`

Start the development server using production settings. **Example:**

`npm start -- --dry-run`

### `lint`

Lint project files using EsLint.

#### options

##### `--include`

Include additional glob patterns for linting.

##### `--ignore-git-untracked`

Ignore files that are not indexed by git.

##### `--disable-linter`

Disable linter when creating bundles for production or staging.

### `build`

-   Cleans up `/dist` folder
-   Bundles project assets into the `/dist` folder

### `release`

-   Prompts the user for a version
-   Cleans up `/dist` folder
-   Bundles project assets into the `/dist` folder
-   Tags the version in Git

#### NODE_ENV

##### `production`

Minifies the javascript assets.

##### `staging`

No minification is done on javascript assets

#### options

##### `--dry-run`

-   Disables committing files to git
-   Disables creating a git tag

Skipped tasks will print a message in the console

```bash
ℹ [ Dry Run ] Skipping version bump
```

### `profile`

Analyze Webpack bundles and find what is contributing their sizes. This command generates an html graphical chart that automatically opens in the browser as well as a text summary report in the console.

### `test`

Run the tests for your project. (Jest)

#### options

##### `--coverage`

Indicates that test coverage information should be collected and reported in the output. React project leverage the `--coverage` option from Jest. Angular projects use Instanbul to collect coverage metrics. Angular projects output coverage statistics to the console as well as html files in the `{workspaces}/coverage` folder.

```bash
› Started testing
Chrome 59.0.3071 (Mac OS X 10.12.5): Executed 3 of 3 SUCCESS (0.706 secs / 0.082 secs)

=============================== Coverage summary ===============================
Statements   : 27.69% ( 8620/31134 )
Branches     : 9.81% ( 1980/20189 )
Functions    : 22.15% ( 1381/6235 )
Lines        : 27.23% ( 7955/29217 )
================================================================================
✔ Finished testing
```

## Starter Applications

-   [availity-starter-react](https://github.com/Availity/availity-starter-react)
-   [availity-starter-complex](https://github.com/Availity/availity-starter-complex)
-   [availity-starter-wizard](https://github.com/Availity/availity-starter-wizard)
