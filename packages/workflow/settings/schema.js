const Joi = require('joi');
const path = require('path');

const schema = Joi.object()
  .keys({
    development: Joi.object()
      .keys({
        open: Joi.string()
          .default('')
          .allow('')
          .description('Where to open the application in the default browser')
          .example('#/my-route'),
        notification: Joi.boolean()
          .default(true)
          .description('Whether to send webpack build status system notifications'),
        host: Joi.string().default('localhost').description('Webpack dev server host'),
        port: Joi.number().integer().default(3000).description('Webpack dev server port'),
        logLevel: Joi.string()
          .default('custom')
          .description(
            'Allows presets to be used for Webpack log levels. https://webpack.js.org/configuration/stats/#stats.'
          ),
        sourceMap: Joi.string()
          .default('source-map')
          .description('Webpack devtool setting. https://webpack.js.org/configuration/devtool/#devtool'),
        hotLoader: [
          Joi.object()
            .keys({
              enabled: Joi.boolean().default(true),
              experimental: Joi.boolean().default(false)
            })
            .description('Enable or disable react-hot-loader')
            .default(),
          Joi.boolean().default(true).description('Enable or disable react-hot-loader')
        ],
        hotLoaderEntry: Joi.object()
          .instance(RegExp)
          .default(/\/App\.jsx?/)
          .description('The entry point of the hot loader'),
        webpackDevServer: Joi.object(),
        targets: [
          Joi.array()
            .description('Target a specific development environment. https://webpack.js.org/configuration/target/')
            .example(['web', 'es5']),
          Joi.string()
            .description('Target a specific development environment. https://webpack.js.org/configuration/target/')
            .example('web')
            .example('browserslist')
            .default('browserslist: last 1 chrome version, last 1 firefox version, last 1 safari version')
        ],
        babelInclude: Joi.array()
          .items(Joi.string())
          .description('Include additional packages from node_modules that should be compiled by Babel and Webpack.')
          .example(['react-loadable'])
          .default([])
      })
      .unknown()
      .default(),
    app: Joi.object()
      .keys({
        title: Joi.string()
          .default('Availity')
          .description('Page title to use for the generated HTML document')
          .example('Availity ID Card Viewer')
      })
      .default(),
    testing: Joi.object()
      .keys({
        browsers: Joi.array().items(Joi.string()).default(['Chrome'])
      })
      .default(),
    globals: Joi.object()
      .default({
        __DEV__: false,
        __TEST__: false,
        __PROD__: false,
        __STAGING__: false
      })
      .unknown()
      .example({
        BROWSER_SUPPORTS_HTML5: true,
        EXPERIMENTAL_FEATURE: false
      }),
    ekko: Joi.object()
      .keys({
        enabled: Joi.boolean().description('Enables or disables Ekko'),
        port: Joi.number().integer().description('The port to run Ekko on'),
        latency: Joi.number().description('Set a latency for all route responses'),
        data: Joi.string().description('Folder that contains the mock data files'),
        routes: Joi.string().description('Path to route configuration file used by Ekko to build Express routes'),
        plugins: Joi.array()
          .items(Joi.string())
          .description(
            'Array of NPM module names that enhance Ekko with additional data and routes. https://github.com/Availity/availity-mock-data'
          ),
        pluginContext: Joi.string().description(
          'Mock data can be passed a context so that HATEOS links traverse correctly'
        )
      })
      .unknown()
      .default((parent) => ({
        enabled: true,
        port: 0,
        latency: 250,
        data: path.join(process.cwd(), 'project/data'),
        routes: path.join(process.cwd(), 'project/config/routes.json'),
        plugins: ['@availity/mock-data'],
        pluginContext: `http://${parent.development.host}:${parent.development.port}/api`
      })),
    proxies: Joi.array()
      .items(
        Joi.object()
          .keys({
            context: Joi.array()
              .items(Joi.string())
              .description('URL context used to match the activation of the proxy per request'),
            target: Joi.string().description('Host and port number for proxy'),
            enabled: Joi.boolean().default(true).description('Enables or disables the proxy configuration'),
            logLevel: Joi.string().default('info').description('The log level'),
            pathRewrite: Joi.object().description(
              'Rewrites (using regex) the a path before sending request to proxy target.'
            ),
            headers: Joi.object().description('Send default headers to the proxy destination')
          })
          .unknown()
      )
      .default((parent) => [
        {
          context: ['/api', '/ms'],
          target: `http://${parent.development.host}:${parent.ekko.port}`,
          enabled: true,
          logLevel: 'info',
          pathRewrite: {
            '^/api': ''
          },
          headers: {
            RemoteUser: 'jsmith'
          }
        }
      ]),
    experiments: Joi.object()
      .description('Configure experimental Webpack features. https://webpack.js.org/configuration/experiments/')
      .example({
        lazyCompilation: true
      })
      .default({})
  })
  .unknown();

module.exports = schema;
