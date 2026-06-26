import type { Router } from 'express';

export interface EkkoOptions {
  data?: string;
  routes?: string;
  plugins?: string[];
  port?: number;
  host?: string;
  pluginContext?: string;
  latency?: number;
  logProvider?: () => Record<string, (...args: unknown[]) => void>;
}

declare class Ekko {
  constructor(ekkoConfig?: string | EkkoOptions);
  middleware(options: EkkoOptions): Promise<Router>;
  start(options: EkkoOptions): Promise<boolean>;
  stop(): Promise<boolean>;
  config(): unknown;
}

export default Ekko;
