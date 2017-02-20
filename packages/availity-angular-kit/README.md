To see a list of commands available for development and deployment, run:

```bash
❯ npm run help

Usage: av <command> [options]

Commands:
  start    Start the development server
  lint     Lint source files using ESLint
  release  Bundle project for distribution (production, staging or integration)
  test     Run your tests using Karma and Phantom.js
  about    About availity-workflow

Options:
  -h, --help  Show help

Examples:
  av start
  av lint
```

**Command specific help**
```bash
npm run help <command>
```

**Example**
```
❯ npm run help lint

Options:
--include, -i  Glob patterns to INCLUDE for ESLint scanning
-h, --help     Show help
```

> Passing command ling arguements to the CLI requires `--` before the arguments else they won't get recognized when running through NPM.
```
❯ npm run lint -- --include=**/*.js
```
