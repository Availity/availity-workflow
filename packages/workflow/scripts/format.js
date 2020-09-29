/* eslint-disable unicorn/prefer-string-slice */
const friendlySyntaxErrorLabel = 'Syntax error:';

function isLikelyASyntaxError(message) {
  return message.indexOf(friendlySyntaxErrorLabel) !== -1;
}

// Cleans up webpack error messages.
function formatMessage(message) {
  let lines = message.split('\n');

  // Remove webpack-specific loader notation from filename.
  // Before:
  // ./~/css-loader!./~/postcss-loader!./src/App.css
  // After:
  // ./src/App.css
  if (lines[0].lastIndexOf('!') !== -1) {
    lines[0] = lines[0].substr(lines[0].lastIndexOf('!') + 1);
  }

  // line #0 is filename
  // line #1 is the main error message
  if (!lines[0] || !lines[1]) {
    return lines.join('\n');
  }

  // Cleans up verbose "module not found" messages for files and packages.
  if (lines[1].indexOf('Module not found: ') === 0) {
    lines = [
      lines[0],
      // Clean up message because "Module not found: " is descriptive enough.
      lines[1]
        .replace("Cannot resolve 'file' or 'directory' ", '')
        .replace('Cannot resolve module ', '')
        .replace('Error: ', ''),
      // Skip all irrelevant lines.
      // (For some reason they only appear on the client in browser.)
      '',
      lines[lines.length - 1] // error location is the last line
    ];
  }

  // Cleans up syntax error messages.
  if (lines[1].indexOf('Module build failed: ') === 0) {
    const cleanedLines = [];
    lines.forEach((line) => {
      if (line !== '') {
        cleanedLines.push(line);
      }
    });
    // We are clean now!
    lines = cleanedLines;
    // Finally, brush up the error message a little.
    lines[1] = lines[1].replace('Module build failed: SyntaxError:', friendlySyntaxErrorLabel);
  }

  // Reassemble the message.
  message = lines.join('\n');
  // Internal stacks are generally useless so we strip them... with the
  // exception of stacks containing `webpack:` because they're normally
  // from user code generated by WebPack. For more information see
  // https://github.com/facebookincubator/create-react-app/pull/1050
  message = message.replace(/^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm, ''); // at ... ...:x:y

  return message;
}

function formatWebpackMessages(json) {
  const formattedErrors = json.errors.map((message) => `Error in ${formatMessage(message)}`);
  const formattedWarnings = json.warnings.map((message) => `Warning in ${formatMessage(message)}`);
  const result = {
    errors: formattedErrors,
    warnings: formattedWarnings
  };
  // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
  if (result.errors.some(isLikelyASyntaxError)) {
    // If there are any syntax errors, show just them.
    // This prevents a confusing ESLint parsing error
    // preceding a much more useful Babel syntax error.
    // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
    result.errors = result.errors.filter(isLikelyASyntaxError);
  }

  // Only keep the first error. Others are often indicative
  // of the same problem, but confuse the reader with noise.
  if (result.errors.length > 1) {
    result.errors.length = 1;
  }

  return result;
}

module.exports = formatWebpackMessages;
