'use strict';

module.exports = [

  { test: /[\\\/]angular\.js$/, loader: 'expose?angular!exports?angular' },
  { test: /[\\\/]jquery\.js$/, loader: 'expose?$!expose?jQuery' },
  { test: /[\\\/]lodash\.js$/, loader: 'expose?_' },
  { test: /[\\\/]moment\.js$/, loader: 'expose?moment' },
  {
    test: /\.html$/,
    loader: 'html',
    // Ignore following templates else errors like:
    //    - "window is not defined" error from the html-webpack-plugin
    //    - "The path for file doesn't contains relativeTo param"  from ngtemplate-loader
    exclude: /(index\.html|react-template\.html|angular-template\.html)/
  },
  {
    test: /\.htm$/,
    loader: `ngtemplate?relativeTo=${process.cwd()}/!html`,
    // Ignore following templates else errors like:
    //    - "window is not defined" error from the html-webpack-plugin
    //    - "The path for file doesn't contains relativeTo param"  from ngtemplate-loader
    exclude: /(index\.html|react-template\.html|angular-template\.html)/
  }
];

