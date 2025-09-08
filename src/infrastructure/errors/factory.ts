import { ApplicationError } from './ApplicationError';
import { isApplicationError } from './guards';
import {
  ApiError,
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  NetworkError,
  NotFoundError,
  RateLimitError,
  ValidationError,
} from './types';

const HTTP_ERROR_MAP: Record<
  number,
  (message: string, context?: Record<string, unknown>) => ApplicationError
> = {
  400: (message, context) => new ValidationError(message, context),
  401: (message, context) => new AuthenticationError(message, context),
  403: (message, context) => new AuthorizationError(message, context),
  404: (message, context) => new NotFoundError(message || 'Resource', context),
  409: (message, context) => new ConflictError(message, context),
  429: (message, context) => new RateLimitError(message, undefined, context),
};

function getEndpoint(context?: Record<string, unknown>): string {
  const endpoint = (context as { endpoint?: unknown })?.endpoint;
  return typeof endpoint === 'string' ? endpoint : 'unknown';
}

export const ErrorFactory = {
  fromHttpStatus(
    status: number,
    message: string,
    context?: Record<string, unknown>
  ): ApplicationError {
    const createError = HTTP_ERROR_MAP[status];
    if (createError) {
      return createError(message, context);
    }
    if (status >= 500) {
      return new ApiError(message, getEndpoint(context), status, context);
    }
    return new ApplicationError(message, 'HTTP_ERROR', status, true, context);
  },

  fromNetworkFailure(message: string, endpoint?: string, cause?: Error): NetworkError {
    return new NetworkError(message, { endpoint }, cause);
  },

  fromUnknownError(error: unknown, context?: Record<string, unknown>): ApplicationError {
    if (isApplicationError(error)) {
      return error;
    }
    const message =
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as { message?: unknown }).message === 'string'
        ? (error as { message: string }).message
        : 'Unknown error occurred';
    const cause = error instanceof Error ? error : undefined;
    return new ApplicationError(message, 'UNKNOWN_ERROR', 500, false, context, cause);
  },
};

export default ErrorFactory;
