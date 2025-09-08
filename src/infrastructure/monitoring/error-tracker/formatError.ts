import { isApplicationError } from '@/src/infrastructure/errors';

import type { ErrorContext } from './types';
import type { ApplicationError } from '@/src/infrastructure/errors';

export function formatError(
  error: Error | ApplicationError,
  context?: ErrorContext
): Record<string, unknown> {
  return {
    message: error.message,
    stack: error.stack,
    name: error.name,
    ...(isApplicationError(error)
      ? {
          code: error.code,
          statusCode: error.statusCode,
          isOperational: error.isOperational,
          context: error.context,
        }
      : {}),
    trackingContext: context,
  };
}
