import type { Configuration as WebpackConfig } from 'webpack';

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
   * Maps to Vitest's `server.deps.inline`. Accepts strings or RegExp patterns.
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
  open?: string | false;
  notification?: boolean;
  host?: string;
  port?: number;
  stats?: { level?: string };
  infrastructureLogging?: { level?: string };
  sourceMap?: string;
  hotLoader?: boolean;
  historyFallback?: boolean;
  webpackDevServer?: Record<string, unknown>;
  targets?: string | string[];
  babelInclude?: string[];
  /**
   * @deprecated Use `vitestOverrides` instead.
   * Supports a limited subset of legacy Jest/Vitest options for backward compatibility:
   * `collectCoverageFrom`, `coveragePathIgnorePatterns`, `testTimeout`.
   */
  jestOverrides?: Record<string, unknown>;
  vitestOverrides?: VitestOverrides;
  suppressDeprecationWarnings?: boolean;
  /**
   * Override the Vite resolve conditions used during testing.
   *
   * Defaults to `['browser', 'module', 'import', 'default']`, which intentionally
   * excludes the Node 22 `module-sync` condition to prevent vmThreads failures on Linux.
   *
   * Only set this if you need a custom condition order or need to re-add `module-sync`.
   */
  resolveConditions?: string[];
}

export interface AppConfig {
  title?: string;
}

export interface EkkoConfig {
  enabled?: boolean;
  port?: number;
  latency?: number;
  data?: string;
  routes?: string;
  plugins?: string[];
  pluginContext?: string;
}

export interface ProxyConfig {
  context?: string | string[];
  target?: string;
  enabled?: boolean;
  logLevel?: string;
  pathRewrite?: Record<string, string>;
  headers?: Record<string, string>;
  contextRewrite?: boolean;
  onProxyReq?: (...args: unknown[]) => void;
  onProxyRes?: (...args: unknown[]) => void;
  onError?: (...args: unknown[]) => void;
}

export interface EslintConfig {
  /**
   * Fail the lint run if there are any ESLint errors.
   * @default true
   */
  failOnError?: boolean;
  /**
   * Fail the lint run if there are any ESLint warnings.
   * Superseded by `maxWarnings` when both are set.
   * @default false
   */
  failOnWarning?: boolean;
  /**
   * Automatically fix all auto-fixable ESLint problems and write changes to disk.
   * Applied during `av lint` only.
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
   */
  maxWarnings?: number;
}

export interface WorkflowConfig {
  development?: DevelopmentConfig;
  app?: AppConfig;
  globals?: Record<string, boolean | string>;
  ekko?: EkkoConfig;
  proxies?: ProxyConfig[];
  experiments?: Record<string, unknown>;
  eslint?: EslintConfig;
  modifyWebpackConfig?: (webpackConfig: WebpackConfig, settings: Settings) => WebpackConfig;
}

export type WorkflowConfigFunction = (config: WorkflowConfig) => WorkflowConfig;

export default class Settings {
  static create(options?: { shouldMimicStaging?: boolean }): Promise<Settings>;

  configuration: WorkflowConfig;
  workflowConfigPath: string;
  devServerPort: number;
  ekkoServerPort: number;
  shouldMimicStaging: boolean;
  _version: string | undefined;

  app(): string;
  project(): string;
  output(): string;
  pkg(contents?: string): Record<string, unknown>;
  config(): WorkflowConfig;
  title(): string;
  host(): string;
  port(): number;
  ekkoPort(): number;
  open(): string | undefined;
  historyFallback(): boolean;
  isNotifications(): boolean;
  enableHotLoader(): boolean;
  isEkko(): boolean;
  eslint(): EslintConfig;
  experimentalWebpackFeatures(): Record<string, unknown>;
  include(): (string | RegExp)[];
  sourceMap(): string;
  fileName(): string;
  chunkFileName(): string;
  developmentTargets(): string;
  globals(): Record<string, unknown>;
  statsLogLevel(): string;
  infrastructureLogLevel(): string;
  asset(workflowFilePath: string, projectFilePath: string): string;
  environment(): string;
  isDevelopment(): boolean;
  isTesting(): boolean;
  isProduction(): boolean;
  isStaging(): boolean;
  isDistribution(): boolean;
  isDryRun(): boolean;
  isProfile(): boolean;
  isIgnoreUntracked(): boolean;
  isVerbose(): boolean;
  isLinterDisabled(): boolean;
  commitMessage(): string | undefined;
  js(): string[];
  log(): void;
}
