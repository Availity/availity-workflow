import Joi from 'joi';
import path from 'node:path';

const schema = Joi.object()
  .keys({
    development: Joi.object()
      .keys({
        open: Joi.alternatives()
          .try(Joi.boolean().valid(false), Joi.string().allow(''))
          .default('/')
          .description(
            'Where to open the application in the default browser. Set to a path string (e.g. "#/my-route") or false to disable.'
          )
          .example('#/my-route'),
        notification: Joi.boolean()
          .default(true)
          .description('Whether to send webpack build status system notifications'),
        host: Joi.string()
          .default('localhost')
          .description(
            'Webpack dev server host. Defaults to "localhost" (loopback only). Set to "0.0.0.0" to ' +
              'bind all interfaces (e.g. for LAN testing or running the dev server directly in Docker).'
          ),
        port: Joi.number().integer().min(1024).max(65535).default(3000).description('Webpack dev server port'),
        stats: Joi.object()
          .keys({
            level: Joi.string()
              .default('minimal')
              .description(
                'Allows presets to be used for Webpack stats log levels. https://webpack.js.org/configuration/stats/#stats'
              ),
          })
          .default(),
        infrastructureLogging: Joi.object()
          .keys({
            level: Joi.string()
              .default('warn')
              .description(
                'Allows presets to be used for Webpack infrastructure log levels. https://webpack.js.org/configuration/other-options/#infrastructurelogging'
              ),
          })
          .default(),
        sourceMap: Joi.string()
          .default('source-map')
          .description('Webpack devtool setting. https://webpack.js.org/configuration/devtool/#devtool'),
        hotLoader: Joi.boolean().default(true).description('Enable or disable React Fast Refresh'),
        historyFallback: Joi.boolean()
          .default(true)
          .description('Enable webpack-dev-server historyApiFallback for single-page apps'),
        webpackDevServer: Joi.object(),
        targets: Joi.alternatives()
          .try(
            Joi.array()
              .description('Target a specific development environment. https://webpack.js.org/configuration/target/')
              .example(['web', 'es5']),
            Joi.string()
              .description('Target a specific development environment. https://webpack.js.org/configuration/target/')
              .example('web')
              .example('browserslist')
              .default('browserslist: last 1 chrome version, last 1 firefox version, last 1 safari version')
          )
          .default('browserslist: last 1 chrome version, last 1 firefox version, last 1 safari version'),
        babelInclude: Joi.array()
          .items(Joi.string())
          .description('Additional node_modules packages to include in compilation and testing transforms')
          .example(['react-loadable'])
          .default([]),
        jestOverrides: Joi.object()
          .keys({})
          .unknown()
          .description(
            'Customize vitest configuration options (legacy name for compatibility). https://vitest.dev/config/'
          )
          .example({ collectCoverageFrom: ['project/app/**/*.{ts|tsx}', '!project/app/**/*.d.ts'] })
          .default({}),
        vitestOverrides: Joi.object()
          .keys({})
          .unknown()
          .description(
            'Vitest configuration overrides merged directly into the test config. https://vitest.dev/config/'
          )
          .default({}),
        suppressDeprecationWarnings: Joi.boolean()
          .default(false)
          .description('Suppress Node.js deprecation warnings during builds'),
        resolveConditions: Joi.array()
          .items(Joi.string())
          .optional()
          .description(
            'Override the Vite resolve conditions used during testing. ' +
              'Defaults to ["browser", "module", "import", "default"], which intentionally excludes ' +
              'the Node 22 `module-sync` condition to prevent vmThreads failures on Linux. ' +
              'Set this if you need a custom condition (e.g. ["browser", "import", "default", "require"]).'
          ),
      })
      .unknown()
      .default(),
    app: Joi.object()
      .keys({
        title: Joi.string()
          .default('Availity')
          .description('Page title to use for the generated HTML document')
          .example('Availity ID Card Viewer'),
      })
      .default(),
    globals: Joi.object().default({}).unknown().example({
      BROWSER_SUPPORTS_HTML5: true,
      EXPERIMENTAL_FEATURE: false,
    }),
    ekko: Joi.object()
      .keys({
        enabled: Joi.boolean().default(true).description('Enables or disables Ekko'),
        port: Joi.number().integer().min(1024).max(65535).default(9999).description('The port to run Ekko on'),
        latency: Joi.number().default(250).description('Set a latency for all route responses'),
        data: Joi.string()
          .default(() => path.join(process.cwd(), 'project/data'))
          .description('Folder that contains the mock data files. Default: project/data'),
        routes: Joi.string()
          .default(() => path.join(process.cwd(), 'project/config/routes.json'))
          .description(
            'Path to route configuration file used by Ekko to build Express routes. Default: project/config/routes.json'
          ),
        plugins: Joi.array()
          .items(Joi.string())
          .default(['@availity/mock-data'])
          .description(
            'Array of NPM module names that enhance Ekko with additional data and routes. https://github.com/Availity/availity-mock-data'
          ),
        pluginContext: Joi.string().description(
          'Mock data can be passed a context so that HATEOS links traverse correctly. ' +
            'Defaults to http://{host}:{port}/api using the resolved dev server host and port.'
        ),
      })
      .unknown()
      .default(),
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
          pathRewrite: {
            '^/api': '',
          },
          headers: {
            RemoteUser: 'jsmith',
          },
        },
      ]),
    experiments: Joi.object()
      .description('Configure experimental Webpack features. https://webpack.js.org/configuration/experiments/')
      .example({
        lazyCompilation: true,
      })
      .default({}),
    eslint: Joi.object()
      .keys({
        failOnError: Joi.boolean().default(true).description('Fail the lint run if there are any ESLint errors'),
        failOnWarning: Joi.boolean().default(false).description('Fail the lint run if there are any ESLint warnings'),
        fix: Joi.boolean().default(false).description('Automatically fix fixable ESLint problems'),
        quiet: Joi.boolean().default(false).description('Report errors only — suppress warnings from lint output'),
        maxWarnings: Joi.number()
          .integer()
          .min(0)
          .optional()
          .description(
            'Number of warnings allowed before the lint run fails. ' +
              'Overrides failOnWarning when set (e.g. maxWarnings: 0 fails on any warning, 10 allows up to 10).'
          ),
      })
      .unknown()
      .default({}),
    modifyWebpackConfig: Joi.function()
      .optional()
      .description(
        'Function to modify the Webpack configuration. Receives (webpackConfig, settings) and should return modified config'
      ),
  })
  .unknown();

export default schema;
