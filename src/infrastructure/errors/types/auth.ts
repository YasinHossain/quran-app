import { ApplicationError } from '../ApplicationError';

export class AuthenticationError extends ApplicationError {
  constructor(
    message: string = 'Authentication required',
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, 'AUTHENTICATION_ERROR', 401, true, context, cause);
  }

  getUserMessage(): string {
    return 'Please sign in to continue.';
  }
}

export class AuthorizationError extends ApplicationError {
  constructor(
    message: string = 'Insufficient permissions',
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, 'AUTHORIZATION_ERROR', 403, true, context, cause);
  }

  getUserMessage(): string {
    return 'You do not have permission to perform this action.';
  }
}
