import { Logger, logger } from './Logger';

/**
 * Performance logging utility
 */
export class PerformanceLogger {
  private logger: Logger;
  private timers: Map<string, number> = new Map();

  constructor(logger?: Logger) {
    this.logger = logger || Logger.getInstance();
  }

  /**
   * Start performance timer
   */
  start(operation: string): void {
    this.timers.set(operation, performance.now());
  }

  /**
   * End performance timer and log duration
   */
  end(operation: string, context?: Record<string, unknown>): number {
    const startTime = this.timers.get(operation);
    if (!startTime) {
      this.logger.warn(`Performance timer '${operation}' was not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.timers.delete(operation);

    this.logger.info(`Performance: ${operation}`, {
      ...context,
      duration: `${duration.toFixed(2)}ms`,
      operation,
    });

    return duration;
  }

  /**
   * Measure async operation
   */
  async measure<T>(
    operation: string,
    fn: () => Promise<T>,
    context?: Record<string, unknown>,
  ): Promise<T> {
    this.start(operation);
    try {
      const result = await fn();
      this.end(operation, context);
      return result;
    } catch (error) {
      this.end(operation, { ...context, error: true });
      throw error;
    }
  }

  /**
   * Measure sync operation
   */
  measureSync<T>(operation: string, fn: () => T, context?: Record<string, unknown>): T {
    this.start(operation);
    try {
      const result = fn();
      this.end(operation, context);
      return result;
    } catch (error) {
      this.end(operation, { ...context, error: true });
      throw error;
    }
  }
}

export const perfLogger = new PerformanceLogger(logger);
