import { useCallback } from 'react';
import { useService } from '../providers/DIProvider';
import { TYPES } from '../../shared/config/container';
import { ILogger } from '../../domain/services/ILogger';

interface LoggerHook {
  info: (message: string, data?: any) => void;
  warn: (message: string, data?: any) => void;
  error: (message: string, error?: Error | any) => void;
  debug: (message: string, data?: any) => void;
  logUserAction: (action: string, data?: any) => void;
  logApiCall: (endpoint: string, method: string, duration?: number) => void;
  logPerformance: (operation: string, duration: number) => void;
  logCacheOperation: (operation: string, key: string, hit?: boolean) => void;
}

export const useLogger = (): LoggerHook => {
  const logger = useService<ILogger>(TYPES.ILogger);

  const logUserAction = useCallback(
    (action: string, data?: any) => {
      const log = logger as any; // Type assertion for specialized methods
      if (log.logUserAction) {
        log.logUserAction(action, data);
      } else {
        logger.info(`User action: ${action}`, data);
      }
    },
    [logger]
  );

  const logApiCall = useCallback(
    (endpoint: string, method: string, duration?: number) => {
      const log = logger as any;
      if (log.logApiCall) {
        log.logApiCall(endpoint, method, duration);
      } else {
        logger.info(`API ${method} ${endpoint}`, {
          duration: duration ? `${duration}ms` : undefined,
        });
      }
    },
    [logger]
  );

  const logPerformance = useCallback(
    (operation: string, duration: number) => {
      const log = logger as any;
      if (log.logPerformance) {
        log.logPerformance(operation, duration);
      } else {
        logger.info(`Performance: ${operation}`, { duration: `${duration}ms` });
      }
    },
    [logger]
  );

  const logCacheOperation = useCallback(
    (operation: string, key: string, hit: boolean = false) => {
      const log = logger as any;
      if (log.logCacheOperation) {
        log.logCacheOperation(operation, key, hit);
      } else {
        logger.debug(`Cache ${operation}: ${key}`, { hit });
      }
    },
    [logger]
  );

  return {
    info: useCallback((message: string, data?: any) => logger.info(message, data), [logger]),
    warn: useCallback((message: string, data?: any) => logger.warn(message, data), [logger]),
    error: useCallback(
      (message: string, error?: Error | any) => logger.error(message, error),
      [logger]
    ),
    debug: useCallback((message: string, data?: any) => logger.debug(message, data), [logger]),
    logUserAction,
    logApiCall,
    logPerformance,
    logCacheOperation,
  };
};

// Performance measurement hook
export const usePerformanceLogger = () => {
  const { logPerformance } = useLogger();

  const measurePerformance = useCallback(
    async <T>(operation: string, fn: () => Promise<T>): Promise<T> => {
      const start = performance.now();
      try {
        const result = await fn();
        const duration = performance.now() - start;
        logPerformance(operation, duration);
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        logPerformance(`${operation} (failed)`, duration);
        throw error;
      }
    },
    [logPerformance]
  );

  return { measurePerformance };
};
