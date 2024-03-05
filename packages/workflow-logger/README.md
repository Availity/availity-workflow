# @availity/workflow-logger

> Simple colorized logger for availity-workflow

## Stack
- [chalk](https://www.npmjs.com/package/chalk) for color palette.
- [figures](https://www.npmjs.com/package/figures) for symbols
- [boxen](https://www.npmjs.com/package/boxen) for terminal boxes

## Usage

```js
import Logger from '@availity/workflow-logger';
Logger.warn('Caution: Here be dragons.');
```

## Static Methods

### `warn`
`console.log` message in `yellow`.

### `error`
`console.log` message in `red`.

### `info`
`console.log` message in `gray`.

### `debug`
Same as `info`.

### `log`
Same as `info`.

### `simple`
Alias for `console.log` and does not use colors.

### `empty`
Prints an empty line in the terminal.

### `failed`
Prints an error message in `red` with a cross symbol and error label

```bash
✖ [ ERROR ] Failed linting
```

### `message`
Prints info message with custom label or **INFO** if not label is provided

```bash
ℹ [ Dry Run ] Skipping version bump
```

### `success`
Prints a success message in `green` with a checkbox symbol.

```bash
✔︎ Finished linting
```

### `box`
Terminal message wrapped in a box.

```bash
+--------------------------------------------------+
|                                                  |
|   The app is running at http://localhost:3000/   |
|                                                  |
+--------------------------------------------------+
```
