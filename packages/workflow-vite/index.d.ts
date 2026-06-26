import type { UserConfig as ViteConfig } from 'vite';

export interface DevelopmentConfig {
  open?: string;
  notification?: boolean;
  host?: string;
  port?: number;
  sourceMap?: boolean;
  babelInclude?: string[];
  jestOverrides?: Record<string, unknown>;
  vitestOverrides?: Record<string, unknown>;
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
  /** Will cause the module build to fail if there are any errors */
  failOnError?: boolean;
  /** Will cause the module build to fail if there are any warnings */
  failOnWarning?: boolean;
  /** Apply fixes */
  fix?: boolean;
  /** Will process and report errors only and ignore warnings */
  quiet?: boolean;
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
  open(): string | undefined;
  isEkko(): boolean;
  isLinterDisabled(): boolean;
  isIgnoreUntracked(): boolean;
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
