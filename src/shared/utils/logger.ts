import { container } from '../config/container';
import { TYPES } from '../config/container';
import { ILogger } from '../../domain/services/ILogger';

// Singleton logger instance
let loggerInstance: ILogger | null = null;

export const getLogger = (): ILogger => {
  if (!loggerInstance) {
    loggerInstance = container.get<ILogger>(TYPES.ILogger);
  }
  return loggerInstance;
};

// Convenience functions for logging
export const logger = {
  info: (message: string, data?: any) => getLogger().info(message, data),
  warn: (message: string, data?: any) => getLogger().warn(message, data),
  error: (message: string, error?: Error | any) => getLogger().error(message, error),
  debug: (message: string, data?: any) => getLogger().debug(message, data),
};

// Specialized logging functions for common Quran app scenarios
export const logUserAction = (action: string, data?: any) => {
  const log = getLogger() as any; // Type assertion for specialized methods
  if (log.logUserAction) {
    log.logUserAction(action, data);
  } else {
    logger.info(`User action: ${action}`, data);
  }
};

export const logApiCall = (endpoint: string, method: string, duration?: number) => {
  const log = getLogger() as any;
  if (log.logApiCall) {
    log.logApiCall(endpoint, method, duration);
  } else {
    logger.info(`API ${method} ${endpoint}`, { duration: duration ? `${duration}ms` : undefined });
  }
};

export const logPerformance = (operation: string, duration: number) => {
  const log = getLogger() as any;
  if (log.logPerformance) {
    log.logPerformance(operation, duration);
  } else {
    logger.info(`Performance: ${operation}`, { duration: `${duration}ms` });
  }
};

export const logCacheOperation = (operation: string, key: string, hit: boolean = false) => {
  const log = getLogger() as any;
  if (log.logCacheOperation) {
    log.logCacheOperation(operation, key, hit);
  } else {
    logger.debug(`Cache ${operation}: ${key}`, { hit });
  }
};

// Performance measurement utility
export const measurePerformance = async <T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    logPerformance(operation, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(`Performance measurement failed for ${operation}`, error);
    logPerformance(`${operation} (failed)`, duration);
    throw error;
  }
};

// API call measurement utility
export const measureApiCall = async <T>(
  endpoint: string,
  method: string,
  fn: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    logApiCall(endpoint, method, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(`API call failed: ${method} ${endpoint}`, error);
    logApiCall(`${endpoint} (failed)`, method, duration);
    throw error;
  }
};
