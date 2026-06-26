# @availity/workflow-logger

> Simple colorized logger for @availity/workflow

## Stack

- [chalk](https://www.npmjs.com/package/chalk) for color palette
- [boxen](https://www.npmjs.com/package/boxen) for terminal boxes

## Usage

```js
import Logger from '@availity/workflow-logger';

Logger.warn('Caution: Here be dragons.');
Logger.success('Build complete!');
```

## Static Methods

### `warn`
Log message in `yellow`.

### `error`
Log message in `red`.

### `info`
Log message in `gray`.

### `debug`
Same as `info`.

### `log`
Same as `info`.

### `simple`
Alias for `console.log` without colors.

### `empty`
Prints an empty line.

### `failed`
Prints an error message in `red` with a cross symbol and ERROR label.

```bash
✖ [ ERROR ] Failed linting
```

### `alert`
Prints a warning message in `yellow` with a star symbol and WARNING label.

```bash
★ [ WARNING ] Compiled with warnings
```

### `message`
Prints an info message with a custom label (defaults to "INFO").

```bash
ℹ [ Dry Run ] Skipping version bump
```

### `success`
Prints a success message in `green` with a checkmark symbol.

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

## License

[MIT](../../LICENSE)
