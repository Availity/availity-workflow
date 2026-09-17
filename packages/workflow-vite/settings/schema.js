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
            'Where to open the application in the default browser on dev server start. ' +
              'Set to a path string (e.g. "/my-app") to open a specific URL, or false to disable. ' +
              "Default: '/' (open at root)."
          ),
        notification: Joi.boolean().default(true).description('Whether to send build status system notifications'),
        host: Joi.string().default('localhost').description('Vite dev server host'),
        port: Joi.number().integer().min(1024).max(65535).default(3000).description('Vite dev server port'),
        sourceMap: Joi.boolean().default(true).description('Enable source maps in development'),
        suppressDeprecationWarnings: Joi.boolean()
          .default(false)
          .description(
            'Suppress Node.js deprecation warnings during builds and dev server startup. ' +
              'Defaults to false. Enable this if third-party dependencies emit noisy deprecation ' +
              'warnings that you cannot resolve. Set to true to silence them.'
          ),
        babelInclude: Joi.array()
          .items(Joi.string())
          .description(
            '@deprecated Use `development.vitestOverrides.inlineDeps` instead. ' +
              'Additional node_modules packages to inline-transform via Vite during testing (maps to `server.deps.inline`).'
          )
          .default([]),
        resolveConditions: Joi.array()
          .items(Joi.string())
          .optional()
          .description(
            'Override the Vite resolve conditions used during testing. ' +
              'Defaults to ["browser", "module", "import", "default"], which intentionally excludes ' +
              'the Node 22 `module-sync` condition to prevent vmThreads failures on Linux. ' +
              'Set this if you need a custom condition (e.g. ["browser", "import", "default", "require"]).'
          ),
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
        typeCheck: Joi.boolean()
          .default(false)
          .description(
            'Enable TypeScript type checking during the dev server and build. ' +
              'Runs tsc --noEmit in a worker thread via vite-plugin-checker. ' +
              'Type errors appear in the terminal during development and will fail production builds. ' +
              'Requires a tsconfig.json in the project root. Default: false.'
          ),
        optimizeDeps: Joi.array()
          .items(Joi.string())
          .default([])
          .description(
            "Additional packages to add to Vite's optimizeDeps.include list for the dev server and build. " +
              'Merged with the built-in defaults (react, react-dom, react-dom/client, react-router, axios). ' +
              'Use this for packages that have ESM/CJS compatibility issues and need pre-bundling. ' +
              "Example: ['@availity/spaces', 'dayjs']"
          ),
      })
      .unknown()
      .default(),
    app: Joi.object()
      .keys({
        title: Joi.string().default('Availity').description('Page title to use for the generated HTML document'),
      })
      .default(),
    globals: Joi.object()
      .default({})
      .unknown()
      .description(
        'Global constants injected at build and test time. ' +
          '__DEV__, __TEST__, __PROD__, __STAGING__, and process.env.NODE_ENV are always set automatically ' +
          'based on the current environment. Add custom keys here to create additional feature flags.'
      ),
    ekko: Joi.object()
      .keys({
        enabled: Joi.boolean().default(true).description('Enables or disables the mock server'),
        port: Joi.number()
          .integer()
          .min(1024)
          .max(65535)
          .default(9999)
          .description('The port to run the mock server on'),
        latency: Joi.number().default(250).description('Set a default latency (ms) for all mock responses'),
        data: Joi.string()
          .default(() => path.join(process.cwd(), 'project/data'))
          .description('Folder that contains the mock data files. Default: project/data'),
        routes: Joi.string()
          .default(() => path.join(process.cwd(), 'project/config/routes.json'))
          .description('Path to route configuration file. Default: project/config/routes.json'),
        plugins: Joi.array()
          .items(Joi.string())
          .default(['@availity/mock-data'])
          .description('Array of NPM module names that enhance the mock server'),
        pluginContext: Joi.string().description(
          'Context URL for HATEOS links in mock responses. ' +
            'Defaults to http://{host}:{port}/api (uses dev server host and port).'
        ),
      })
      .unknown()
      .default(),
    proxies: Joi.array()
      .items(
        Joi.object()
          .keys({
            context: Joi.alternatives()
              .try(Joi.string(), Joi.array().items(Joi.string()))
              .description('URL context used to match the activation of the proxy per request'),
            target: Joi.string().description('Host and port number for proxy'),
            enabled: Joi.boolean().default(true).description('Enables or disables the proxy configuration'),
            logLevel: Joi.string()
              .default('info')
              .description(
                '@deprecated — has no effect. Vite proxy (http-proxy) does not support per-proxy log levels. ' +
                  'Accepted for backward compatibility with workflow.js configs that set it.'
              ),
            pathRewrite: Joi.object().description(
              'Rewrites (using regex) a path before sending request to proxy target'
            ),
            headers: Joi.object().description('Send default headers to the proxy destination'),
          })
          .unknown()
      )
      .default((parent) => [
        {
          context: ['/api/', '/ms', '/cloud'],
          target: `http://${parent.development.host}:${parent.ekko.port}`,
          enabled: true,
          logLevel: 'info',
          pathRewrite: { '^/api/': '/' },
          // RemoteUser is injected so the mock server can simulate an authenticated user.
          // Change this to match the username expected by your mock routes.
          headers: { RemoteUser: 'jsmith' },
        },
      ])
      .description(
        'Array of proxy configurations. The default proxies /api/, /ms, and /cloud to the mock server. ' +
          'The default RemoteUser header value ("jsmith") simulates an authenticated user for mock responses.'
      ),
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
        watchPath: Joi.alternatives()
          .try(Joi.string(), Joi.array().items(Joi.string()))
          .optional()
          .description(
            'Path or glob patterns to watch for changes during dev server lint checking (vite-plugin-checker). ' +
              'Defaults to the app directory. Useful when linting files outside project/app.'
          ),
      })
      .unknown()
      .default()
      .description('ESLint configuration for both the lint script and dev-server checker'),
    modifyViteConfig: Joi.function()
      .optional()
      .description(
        'Function to modify the Vite configuration. Receives (viteConfig, settings) and should return modified config'
      ),
  })
  .unknown();

export default schema;
