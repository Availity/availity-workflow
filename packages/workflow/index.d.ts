import type { Configuration as WebpackConfig } from 'webpack';

export interface DevelopmentConfig {
  open?: string;
  notification?: boolean;
  host?: string;
  port?: number;
  stats?: { level?: string };
  infrastructureLogging?: { level?: string };
  sourceMap?: string;
  hotLoader?: boolean;
  webpackDevServer?: Record<string, unknown>;
  targets?: string | string[];
  babelInclude?: string[];
  jestOverrides?: Record<string, unknown>;
  vitestOverrides?: Record<string, unknown>;
  suppressDeprecationWarnings?: boolean;
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
  context?: string[];
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
  /** Will cause the module build to fail if there are any errors. Defaults to true in production, false in development. */
  failOnError?: boolean;
  /** Will cause the module build to fail if there are any warnings */
  failOnWarning?: boolean;
  /** The errors found will always be emitted */
  emitError?: boolean;
  /** The warnings found will always be emitted */
  emitWarning?: boolean;
  /** Specify the extensions that should be checked */
  extensions?: string | string[];
  /** Specify the files and/or directories to exclude */
  exclude?: string | string[];
  /** Specify directories, files, or globs */
  files?: string | string[];
  /** Apply fixes */
  fix?: boolean;
  /** Lint only changed files, skip linting on start */
  lintDirtyModulesOnly?: boolean;
  /** Will process and report errors only and ignore warnings */
  quiet?: boolean;
  /** Enable file caching */
  cache?: boolean;
  /** Path to `eslint` instance that will be used for linting */
  eslintPath?: string;
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
  isLinterDisabled(): boolean;
  commitMessage(): string | undefined;
  js(): string[];
  log(): void;
}
