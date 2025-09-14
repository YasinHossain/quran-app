import { ILogger } from '@/src/domain/interfaces/ILogger';

import { logger } from './Logger';

/**
 * Infrastructure implementation of the domain logging interface
 * This adapter allows the domain and application layers to log without direct dependency on infrastructure
 */
export class LoggerAdapter implements ILogger {
  info(message: string, context?: Record<string, unknown>, error?: Error): void {
    logger.info(message, context, error);
  }

  warn(message: string, context?: Record<string, unknown>, error?: Error): void {
    logger.warn(message, context, error);
  }

  error(message: string, context?: Record<string, unknown>, error?: Error): void {
    logger.error(message, context, error);
  }

  debug(message: string, context?: Record<string, unknown>, error?: Error): void {
    logger.debug(message, context, error);
  }
}

// Export a singleton instance
export const loggerAdapter = new LoggerAdapter();
