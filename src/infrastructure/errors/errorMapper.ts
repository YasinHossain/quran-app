import { ApplicationError } from '@/src/infrastructure/errors/ApplicationError';

import { ErrorFactory } from './factory';
import { isApplicationError } from './guards';

export function mapError(error: unknown, context?: Record<string, unknown>): ApplicationError {
  return isApplicationError(error) ? error : ErrorFactory.fromUnknownError(error, context);
}
