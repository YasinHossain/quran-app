import { logger } from '@/src/infrastructure/monitoring/Logger';

export const getItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    logger.warn('safeLocalStorage.getItem failed', { key }, error as Error);
    return null;
  }
};

export const setItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    logger.warn('safeLocalStorage.setItem failed', { key }, error as Error);
  }
};

export const removeItem = (key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    logger.warn('safeLocalStorage.removeItem failed', { key }, error as Error);
  }
};

export const clear = (): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.clear();
  } catch (error) {
    logger.warn('safeLocalStorage.clear failed', undefined, error as Error);
  }
};
