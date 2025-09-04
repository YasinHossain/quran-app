/**
 * Monitoring Infrastructure Module
 *
 * Centralized exports for all monitoring functionality.
 * Provides clean imports for logging, error tracking, and performance monitoring.
 */

// Logger exports
export { Logger, LogLevel, logger, type LogEntry, type ILoggerTransport } from './Logger';
export { ConsoleTransport } from './ConsoleTransport';
export { MemoryTransport } from './MemoryTransport';
export { RemoteTransport } from './RemoteTransport';
export { PerformanceLogger, perfLogger } from './PerformanceLogger';

// Error tracker exports
export {
  ErrorTrackerService,
  ConsoleErrorTracker,
  SentryErrorTracker,
  RemoteErrorTracker,
  errorTracker,
  type IErrorTracker,
  type ErrorContext,
} from './ErrorTracker';
