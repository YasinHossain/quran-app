import { AuthenticationError } from './classes/auth';
import { AuthorizationError } from './classes/auth';
import { NotFoundError, ConflictError, ApiError } from './classes/http';
import { RateLimitError, NetworkError } from './classes/network';
import { ValidationError } from './classes/validation';
import { ApplicationError } from './core/ApplicationError';
import { isApplicationError } from './guards';

export const ErrorFactory = {
  fromHttpStatus(
    status: number,
    message: string,
    context?: Record<string, unknown>
  ): ApplicationError {
    switch (true) {
      case status === 400:
        return new ValidationError(message, context);
      case status === 401:
        return new AuthenticationError(message, context);
      case status === 403:
        return new AuthorizationError(message, context);
      case status === 404:
        return new NotFoundError(message || 'Resource', context);
      case status === 409:
        return new ConflictError(message, context);
      case status === 429:
        return new RateLimitError(message, undefined, context);
      case status >= 500:
        return new ApiError(message, (context as any)?.endpoint || 'unknown', status, context);
      default:
        return new ApplicationError(message, 'HTTP_ERROR', status, true, context);
    }
  },

  fromNetworkFailure(message: string, endpoint?: string, cause?: Error): NetworkError {
    return new NetworkError(message, { endpoint }, cause);
  },

  fromUnknownError(error: unknown, context?: Record<string, unknown>): ApplicationError {
    if (isApplicationError(error)) {
      return error;
    }
    const anyErr = error as any;
    const message = anyErr?.message || 'Unknown error occurred';
    const cause = error instanceof Error ? error : undefined;
    return new ApplicationError(message, 'UNKNOWN_ERROR', 500, false, context, cause);
  },
};

export default ErrorFactory;
