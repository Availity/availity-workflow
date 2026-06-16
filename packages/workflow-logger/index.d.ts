declare class Logger {
  constructor(options?: Record<string, unknown>);
  static warn(entry: string): void;
  static error(entry: string | Error): void;
  static info(entry: string): void;
  static debug(entry: string): void;
  static log(entry: string): void;
  static record(entry?: string | Error, color?: string): void;
  static simple(entry: string): void;
  static empty(): void;
  static failed(entry: string): void;
  static alert(entry: string): void;
  static message(entry: string, entryLabel?: string): void;
  static success(entry: string): void;
  static box(entry: string): void;
}

export default Logger;
