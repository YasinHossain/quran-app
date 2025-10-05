/**
 * Logging types and enums extracted to avoid circular dependencies.
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  error?: Error;
  source?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
}

export interface ILoggerTransport {
  log(entry: LogEntry): void | Promise<void>;
  flush?(): void | Promise<void>;
  destroy?(): void | Promise<void>;
}
