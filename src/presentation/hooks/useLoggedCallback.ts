import { useCallback } from 'react';

import { logger } from '@/src/infrastructure/monitoring/Logger';

interface Options<R> {
  defaultValue?: R;
  rethrow?: boolean;
}

export const useLoggedCallback = <A extends unknown[], R>(
  fn: (...args: A) => Promise<R>,
  message: string,
  options: Options<R> = {}
) => {
  const { defaultValue, rethrow } = options;
  return useCallback(
    async (...args: A): Promise<R> => {
      try {
        return await fn(...args);
      } catch (err) {
        logger.error(message, undefined, err as Error);
        if (rethrow) throw err;
        return defaultValue as R;
      }
    },
    [fn, message, defaultValue, rethrow]
  );
};
