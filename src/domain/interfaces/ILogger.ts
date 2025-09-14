/**
 * Domain logging interface
 * This allows the application layer to log without depending on infrastructure
 */
export interface ILogger {
  info(message: string, context?: Record<string, unknown>, error?: Error): void;
  warn(message: string, context?: Record<string, unknown>, error?: Error): void;
  error(message: string, context?: Record<string, unknown>, error?: Error): void;
  debug(message: string, context?: Record<string, unknown>, error?: Error): void;
}
