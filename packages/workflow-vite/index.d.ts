import type { UserConfig as ViteConfig } from 'vite';

export interface VitestOverrides {
  /**
   * Vitest worker pool type.
   * @default 'vmThreads'
   */
  pool?: string;
  /**
   * Test environment. Use `'jsdom'` for browser-like DOM tests, `'node'` for pure Node.js tests.
   * @default 'jsdom'
   */
  environment?: string;
  /**
   * Timeout in milliseconds for each test.
   * @default 5000
   */
  testTimeout?: number;
  /**
   * Additional setup files to run before each test file.
   * Appended to the built-in setup (which auto-registers `@testing-library/jest-dom` if installed).
   */
  setupFiles?: string | string[];
  /**
   * Additional node_modules packages to inline-transform via Vite during testing.
   * Maps to Vitest's `server.deps.inline`.
   *
   * Prefer this over the deprecated `babelInclude` option.
   *
   * @example
   * vitestOverrides: {
   *   inlineDeps: ['some-esm-package', /my-pattern/],
   * }
   */
  inlineDeps?: string | RegExp | (string | RegExp)[];
  /**
   * When `true`, Vitest tries to resolve a CommonJS (CJS) build for packages
   * that have invalid or missing ESM exports (e.g. `dayjs`).
   * @default true
   */
  fallbackCJS?: boolean;
  /**
   * Additional packages to add to Vitest's pre-bundling optimizer (`deps.optimizer.client.include`).
   * Use for packages that cause issues in the test runner due to ESM/CJS packaging.
   */
  optimizeDeps?: string | string[];
  /**
   * Glob patterns for test files to exclude from the test run.
   * Merged with the built-in exclusions (node_modules, dist, scripts, etc.).
   */
  exclude?: string | string[];
  /**
   * Vitest coverage configuration options. Merged with built-in defaults — user values win.
   * Accepts any options from https://vitest.dev/config/#coverage.
   *
   * @example
   * vitestOverrides: {
   *   coverage: {
   *     enabled: true,
   *     thresholds: { lines: 80, branches: 80 },
   *   },
   * }
   */
  coverage?: Record<string, unknown>;
  /**
   * Override the Vite resolve conditions used during testing.
   * Takes precedence over `development.resolveConditions`.
   * See `DevelopmentConfig.resolveConditions` for full documentation.
   */
  resolveConditions?: string[];
  /** Pass-through for any other Vitest config options not explicitly listed above. */
  [key: string]: unknown;
}

export interface DevelopmentConfig {
  /**
   * Where to open the application in the default browser on dev server start.
   * Set to a path string (e.g. `'/'`, `'/my-app'`) to open a specific URL,
   * or `false` to disable auto-open.
   * @default '/'
   */
  open?: string | false;
  /**
   * Show OS-level system notifications for build success and failure events.
   * @default true
   */
  notification?: boolean;
  /**
   * Hostname for the Vite dev server.
   * @default 'localhost'
   */
  host?: string;
  /**
   * Port for the Vite dev server. If the port is already in use, workflow
   * will increment until a free port is found.
   * @default 3000
   */
  port?: number;
  /**
   * Enable JavaScript and SCSS source maps during development.
   * Source maps are always disabled in production builds regardless of this setting.
   * @default true
   */
  sourceMap?: boolean;
  /**
   * Suppress Node.js deprecation warnings during builds and dev server startup.
   * Defaults to `false`. Enable this if third-party dependencies emit noisy deprecation
   * warnings that you cannot resolve.
   * @default false
   */
  suppressDeprecationWarnings?: boolean;
  /**
   * Enable TypeScript type checking during the dev server and production builds.
   * Runs `tsc --noEmit` in a worker thread via `vite-plugin-checker`.
   * Type errors appear in the terminal during development and fail production builds.
   * Requires a `tsconfig.json` in the project root.
   * @default false
   */
  typeCheck?: boolean;
  /**
   * @deprecated Use `vitestOverrides.inlineDeps` instead.
   * Additional node_modules packages to inline-transform via Vite during testing
   * (maps to Vitest's `server.deps.inline`). The name `babelInclude` is a
   * webpack-era holdover — Vite does not use Babel for this.
   */
  babelInclude?: string[];
  /**
   * Override the Vite resolve conditions used during testing.
   *
   * Defaults to `['browser', 'module', 'import', 'default']`, which intentionally
   * excludes the Node 22 `module-sync` condition to prevent vmThreads failures on Linux.
   *
   * Only set this if you need a custom condition order or need to re-add `module-sync`.
   *
   * @example
   * // Re-add module-sync (not recommended on Linux + Node 22 with vmThreads):
   * resolveConditions: ['browser', 'module-sync', 'module', 'import', 'default']
   */
  resolveConditions?: string[];
  /**
   * @deprecated Use `vitestOverrides` instead.
   * Supports a limited subset of legacy Jest/Vitest options for backward compatibility:
   * `collectCoverageFrom`, `coveragePathIgnorePatterns`, `testTimeout`.
   */
  jestOverrides?: Record<string, unknown>;
  /**
   * Vitest configuration overrides. Merged additively with workflow's built-in Vitest config.
   * See {@link VitestOverrides} for all available options.
   */
  vitestOverrides?: VitestOverrides;
  /**
   * Additional packages to add to Vite's `optimizeDeps.include` list for the dev server and builds.
   * Merged with the built-in defaults: `react`, `react-dom`, `react-dom/client`, `react-router`, `axios`.
   *
   * Use this for packages with ESM/CJS compatibility issues that need pre-bundling.
   * Teams still on React Router v6 should add `'react-router-dom'` here.
   *
   * @example
   * development: {
   *   optimizeDeps: ['@availity/spaces', 'dayjs', 'react-router-dom'],
   * }
   */
  optimizeDeps?: string[];
}

export interface AppConfig {
  /**
   * Page `<title>` for the generated HTML document.
   * @default 'Availity'
   */
  title?: string;
}

export interface EkkoConfig {
  /**
   * Enable or disable the built-in mock server (Ekko).
   * Disable if you are proxying to a real API for all routes.
   * @default true
   */
  enabled?: boolean;
  /**
   * Port for the mock server. If the port is already in use, workflow will
   * find the next available port and update proxy targets automatically.
   * @default 9999
   */
  port?: number;
  /**
   * Default artificial latency in milliseconds added to all mock responses.
   * @default 250
   */
  latency?: number;
  /**
   * Folder containing mock data files (JSON, images, etc.).
   * @default '<project-root>/project/data'
   */
  data?: string;
  /**
   * Path to the route configuration file used by the mock server to build Express routes.
   * @default '<project-root>/project/config/routes.json'
   */
  routes?: string;
  /**
   * NPM package names that extend the mock server with additional data and routes.
   * @default ['@availity/mock-data']
   */
  plugins?: string[];
  /**
   * Base URL injected into mock responses for HATEOAS links so they resolve correctly.
   * @default 'http://<host>:<devServerPort>/api'
   */
  pluginContext?: string;
}

export interface ProxyConfig {
  /**
   * URL path prefix(es) that activate this proxy rule.
   * A request is forwarded when its path starts with any of these values.
   *
   * @example
   * context: '/api'
   * context: ['/api', '/ms', '/cloud']
   */
  context?: string | string[];
  /**
   * Destination host and port for proxied requests.
   * @example 'http://localhost:9999'
   */
  target?: string;
  /**
   * Enable or disable this proxy rule without removing it from the config.
   * @default true
   */
  enabled?: boolean;
  /**
   * @deprecated Has no effect. Vite's proxy (http-proxy) does not support per-proxy log levels.
   * Accepted for backward compatibility with existing workflow.js configs.
   */
  logLevel?: string;
  /**
   * Rewrite the request path (using regex) before forwarding to `target`.
   * Keys are regex patterns, values are replacement strings.
   *
   * @example
   * pathRewrite: { '^/api': '' }  // strip /api prefix before forwarding
   */
  pathRewrite?: Record<string, string>;
  /**
   * Static headers added to every request forwarded by this proxy rule.
   *
   * @example
   * headers: { RemoteUser: 'jsmith' }
   */
  headers?: Record<string, string>;
}

export interface EslintConfig {
  /**
   * Fail the lint run (and throw) if there are any ESLint errors.
   * @default true
   */
  failOnError?: boolean;
  /**
   * Fail the lint run if there are any ESLint warnings.
   * Superseded by `maxWarnings` when both are set.
   * Also controls whether warnings appear in the dev server overlay/terminal.
   * @default false
   */
  failOnWarning?: boolean;
  /**
   * Automatically fix all auto-fixable ESLint problems and write changes to disk.
   * Applied during `av lint` only — not during the dev server checker.
   * @default false
   */
  fix?: boolean;
  /**
   * Report errors only — suppress warnings from lint output.
   * Applied during `av lint` only.
   * @default false
   */
  quiet?: boolean;
  /**
   * Maximum number of warnings allowed before the lint run fails.
   * When set, takes precedence over `failOnWarning`.
   * - `0` — fail on any warning
   * - `10` — allow up to 10 warnings before failing
   * Applied during `av lint` only.
   */
  maxWarnings?: number;
  /**
   * Path or glob pattern(s) to watch for changes during the dev server lint check
   * (passed to `vite-plugin-checker` as `watchPath`).
   * Defaults to the app directory. Useful when linting files outside `project/app`.
   */
  watchPath?: string | string[];
}

export interface WorkflowViteConfig {
  /** Development server and build tool configuration. */
  development?: DevelopmentConfig;
  /** Application metadata used in the generated HTML. */
  app?: AppConfig;
  /**
   * Global constants injected at build and test time via Vite's `define`.
   * `__DEV__`, `__TEST__`, `__PROD__`, `__STAGING__`, and `process.env.NODE_ENV`
   * are always set automatically. Add custom keys here to create feature flags.
   *
   * @example
   * globals: {
   *   EXPERIMENTAL_FEATURE: false,
   *   API_URL: 'https://api.example.com',
   * }
   */
  globals?: Record<string, boolean | string>;
  /** Mock server (Ekko) configuration. */
  ekko?: EkkoConfig;
  /**
   * Proxy rules for the dev server. Defaults to a single rule that forwards
   * `/api/`, `/ms`, and `/cloud` to the mock server.
   */
  proxies?: ProxyConfig[];
  /** ESLint configuration for `av lint` and the dev server checker. */
  eslint?: EslintConfig;
  /**
   * Hook to modify or replace the Vite configuration after workflow has built it.
   * Receives the fully constructed config and the settings instance.
   * Must return the (modified) config object.
   *
   * @example
   * modifyViteConfig: (config) => {
   *   config.plugins.push(myPlugin());
   *   return config;
   * }
   */
  modifyViteConfig?: (viteConfig: ViteConfig, settings: Settings) => ViteConfig;
}

export type WorkflowViteConfigFunction = (config: WorkflowViteConfig) => WorkflowViteConfig;

export default class Settings {
  /** Create and fully initialize a Settings instance, resolving ports and loading workflow.js. */
  static create(options?: { shouldMimicStaging?: boolean }): Promise<Settings>;

  /** The fully merged and validated workflow configuration object. */
  configuration: WorkflowViteConfig;
  /** Absolute path to the resolved workflow.js config file (or the schema default if none found). */
  workflowConfigPath: string;
  /** Resolved dev server port (may differ from `configuration.development.port` if that port was in use). */
  devServerPort: number;
  /** Resolved mock server port (may differ from `configuration.ekko.port` if that port was in use). */
  ekkoServerPort: number;
  /** `true` when the dev server is running with staging-like settings. */
  shouldMimicStaging: boolean;
  /** Internal version marker. Not intended for use by application code. */
  _version: string | undefined;

  /** Absolute path to `project/app/`. */
  app(): string;
  /** Absolute path to the project root (where `package.json` lives). */
  project(): string;
  /** Absolute path to the build output directory (`dist/` for production, `build/` otherwise). */
  output(): string;
  /** Parsed contents of the project's `package.json`. */
  pkg(contents?: string): Record<string, unknown>;
  /** Returns the fully merged configuration object. Equivalent to `settings.configuration`. */
  config(): WorkflowViteConfig;
  /** The page title from `app.title`, defaulting to `'Availity'`. */
  title(): string;
  /** The dev server hostname. */
  host(): string;
  /** The resolved dev server port. */
  port(): number;
  /** The resolved mock server port. */
  ekkoPort(): number;
  /** The base URL injected into mock responses for HATEOAS links. */
  ekkoPluginContext(): string;
  /** The `development.open` value — a path string, `false`, or `undefined` if bypassing schema. */
  open(): string | false | undefined;
  /** `true` if the mock server is enabled. */
  isEkko(): boolean;
  /** `true` if linting was disabled via the `--disable-linter` CLI flag. */
  isLinterDisabled(): boolean;
  /** `true` if untracked git files should be ignored during the build. */
  isIgnoreUntracked(): boolean;
  /** `true` if the `--verbose` CLI flag is set. */
  isVerbose(): boolean;
  /** The commit message passed via `--message`, if any. */
  commitMessage(): string | undefined;
  /** Current `NODE_ENV` value. Defaults to `'development'` if not set. */
  environment(): string;
  /** `true` when `NODE_ENV === 'development'`. */
  isDevelopment(): boolean;
  /** `true` when `NODE_ENV === 'test'`. */
  isTesting(): boolean;
  /** `true` when `NODE_ENV === 'production'` or `--production` flag is set. */
  isProduction(): boolean;
  /** `true` when `NODE_ENV === 'staging'` or `shouldMimicStaging` is set. */
  isStaging(): boolean;
  /** `true` for production or staging builds (i.e. outputs to `dist/`). */
  isDistribution(): boolean;
  /** `true` when the `--dry-run` CLI flag is set. */
  isDryRun(): boolean;
  /** Resolved globals map ready for use as Vite's `define` option. */
  globals(): Record<string, unknown>;
  /** Array of file glob patterns for JS/TS source files to lint. */
  js(): string[];
  /** Logs the active workflow config path to the console. */
  log(): void;
}
