'use strict';

module.exports = [

  { test: /[\\\/]angular\.js$/, loader: 'expose?angular!exports?angular' },
  { test: /[\\\/]jquery\.js$/, loader: 'expose?$!expose?jQuery' },
  { test: /[\\\/]lodash\.js$/, loader: 'expose?_' },
  { test: /[\\\/]moment\.js$/, loader: 'expose?moment' },
  {
    test: /\.html$/,
    loader: `ngtemplate?relativeTo=${process.cwd()}/!html`,
    // ignore index.html else "window is not defined" error from
    // the HTML webpack plugin
    exclude: /index\.html/
  }
];

