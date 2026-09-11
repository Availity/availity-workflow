import type { UserConfig as ViteConfig } from 'vite';

export interface VitestOverrides {
  pool?: string;
  environment?: string;
  testTimeout?: number;
  setupFiles?: string | string[];
  /**
   * Additional node_modules packages to inline-transform via Vite during testing.
   * Maps to Vitest's `server.deps.inline`.
   *
   * Prefer this over the deprecated `babelInclude` option.
   *
   * @example
   * vitestOverrides: {
   *   inlineDeps: ['some-esm-package', 'another-package'],
   * }
   */
  inlineDeps?: string | string[];
  fallbackCJS?: boolean;
  optimizeDeps?: string | string[];
  exclude?: string | string[];
  coverage?: Record<string, unknown>;
  /**
   * Override the Vite resolve conditions for this test run.
   * Takes precedence over `development.resolveConditions`.
   * See `DevelopmentConfig.resolveConditions` for full documentation.
   */
  resolveConditions?: string[];
  [key: string]: unknown;
}

export interface DevelopmentConfig {
  /**
   * Where to open the application in the default browser on dev server start.
   * Set to a path string (e.g. `'/'`, `'/my-app'`) to open a specific URL,
   * or `false` to disable auto-open.
   * @default false
   */
  open?: string | false;
  notification?: boolean;
  host?: string;
  port?: number;
  sourceMap?: boolean;
  /**
   * Suppress Node.js deprecation warnings during builds and dev server startup.
   * Defaults to `true` — Vite 8/Rolldown and some upstream packages emit noisy deprecation
   * warnings that applications cannot resolve. Set to `false` to surface them.
   * @default true
   */
  suppressDeprecationWarnings?: boolean;
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
  vitestOverrides?: VitestOverrides;
}

export interface AppConfig {
  title?: string;
}

export interface EkkoConfig {
  /** @default true */
  enabled?: boolean;
  /** @default 9999 */
  port?: number;
  /** Default latency in ms for all mock responses. @default 250 */
  latency?: number;
  /** Folder containing mock data files. @default 'project/data' */
  data?: string;
  /** Path to route configuration file. @default 'project/config/routes.json' */
  routes?: string;
  /** NPM module names that enhance the mock server. @default ['@availity/mock-data'] */
  plugins?: string[];
  /**
   * Context URL for HATEOS links in mock responses.
   * Defaults to `http://{host}:{port}/api` using the resolved dev server host and port.
   */
  pluginContext?: string;
}

export interface ProxyConfig {
  context?: string | string[];
  target?: string;
  enabled?: boolean;
  /**
   * @deprecated Has no effect. Vite's proxy (http-proxy) does not support per-proxy log levels.
   * Accepted for backward compatibility with existing workflow.js configs.
   */
  logLevel?: string;
  pathRewrite?: Record<string, string>;
  headers?: Record<string, string>;
}

export interface WorkflowViteConfig {
  development?: DevelopmentConfig;
  app?: AppConfig;
  globals?: Record<string, boolean | string>;
  ekko?: EkkoConfig;
  proxies?: ProxyConfig[];
  eslint?: EslintConfig;
  modifyViteConfig?: (viteConfig: ViteConfig, settings: Settings) => ViteConfig;
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

export type WorkflowViteConfigFunction = (config: WorkflowViteConfig) => WorkflowViteConfig;

export default class Settings {
  static create(options?: { shouldMimicStaging?: boolean }): Promise<Settings>;

  configuration: WorkflowViteConfig;
  workflowConfigPath: string;
  devServerPort: number;
  ekkoServerPort: number;
  shouldMimicStaging: boolean;
  _version: string | undefined;

  app(): string;
  project(): string;
  output(): string;
  pkg(contents?: string): Record<string, unknown>;
  config(): WorkflowViteConfig;
  title(): string;
  host(): string;
  port(): number;
  ekkoPort(): number;
  ekkoPluginContext(): string;
  open(): string | undefined;
  isEkko(): boolean;
  isLinterDisabled(): boolean;
  isIgnoreUntracked(): boolean;
  isVerbose(): boolean;
  commitMessage(): string | undefined;
  environment(): string;
  isDevelopment(): boolean;
  isTesting(): boolean;
  isProduction(): boolean;
  isStaging(): boolean;
  isDistribution(): boolean;
  isDryRun(): boolean;
  globals(): Record<string, unknown>;
  js(): string[];
  log(): void;
}
