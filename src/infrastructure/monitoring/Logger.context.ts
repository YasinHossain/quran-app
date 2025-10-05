import type { Logger } from './Logger';

export const setContext = (
  current: Record<string, unknown>,
  context: Record<string, unknown>
): Record<string, unknown> => ({
  ...current,
  ...context,
});

export const clearContext = (): Record<string, unknown> => ({});

export const child = (
  logger: Logger,
  current: Record<string, unknown>,
  context: Record<string, unknown>
): Logger => {
  const childLogger = Object.create(logger) as Logger;
  childLogger.setContext({ ...current, ...context });
  return childLogger;
};
