import Joi from 'joi';
import path from 'node:path';

const schema = Joi.object()
  .keys({
    development: Joi.object()
      .keys({
        open: Joi.string().default('').allow('').description('Where to open the application in the default browser'),
        notification: Joi.boolean().default(true).description('Whether to send build status system notifications'),
        host: Joi.string().default('localhost').description('Vite dev server host'),
        port: Joi.number().integer().min(1024).max(65535).default(3000).description('Vite dev server port'),
        sourceMap: Joi.boolean().default(true).description('Enable source maps in development'),
        babelInclude: Joi.array()
          .items(Joi.string())
          .description('Additional node_modules packages to transform during testing')
          .default([]),
        jestOverrides: Joi.object()
          .keys({})
          .unknown()
          .description('Customize vitest configuration options (legacy name for compatibility)')
          .default({}),
        vitestOverrides: Joi.object()
          .keys({})
          .unknown()
          .description(
            'Vitest configuration overrides merged directly into the test config. https://vitest.dev/config/'
          )
          .default({}),
      })
      .unknown()
      .default(),
    app: Joi.object()
      .keys({
        title: Joi.string().default('Availity').description('Page title to use for the generated HTML document'),
      })
      .default(),
    globals: Joi.object()
      .default({ __DEV__: false, __TEST__: false, __PROD__: false, __STAGING__: false })
      .unknown()
      .description('Global constants for feature flags'),
    ekko: Joi.object()
      .keys({
        enabled: Joi.boolean().description('Enables or disables the mock server'),
        port: Joi.number().integer().min(1024).max(65535).description('The port to run the mock server on'),
        latency: Joi.number().description('Set a latency for all route responses'),
        data: Joi.string().description('Folder that contains the mock data files'),
        routes: Joi.string().description('Path to route configuration file'),
        plugins: Joi.array().items(Joi.string()).description('Array of NPM module names that enhance the mock server'),
        pluginContext: Joi.string().description('Context for HATEOS links in mock data'),
      })
      .unknown()
      .default((parent) => ({
        enabled: true,
        port: 9999,
        latency: 250,
        data: path.join(process.cwd(), 'project/data'),
        routes: path.join(process.cwd(), 'project/config/routes.json'),
        plugins: ['@availity/mock-data'],
        pluginContext: `http://${parent.development.host}:${parent.development.port}/api`,
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
              'Rewrites (using regex) a path before sending request to proxy target'
            ),
            headers: Joi.object().description('Send default headers to the proxy destination'),
          })
          .unknown()
      )
      .default((parent) => [
        {
          context: ['/api', '/ms', '/cloud'],
          target: `http://${parent.development.host}:${parent.ekko.port}`,
          enabled: true,
          logLevel: 'info',
          pathRewrite: { '^/api': '' },
          headers: { RemoteUser: 'jsmith' },
        },
      ]),
    eslint: Joi.object()
      .keys({
        failOnError: Joi.boolean(),
      })
      .unknown()
      .default({ failOnError: true })
      .description('ESLint checker configuration'),
    modifyViteConfig: Joi.function()
      .optional()
      .description(
        'Function to modify the Vite configuration. Receives (viteConfig, settings) and should return modified config'
      ),
  })
  .unknown();

export default schema;
