import { ApplicationError } from '../core/ApplicationError';

export class NotFoundError extends ApplicationError {
  constructor(resource: string, context?: Record<string, unknown>, cause?: Error) {
    const message = `${resource} not found`;
    super(message, 'NOT_FOUND', 404, true, { resource, ...context }, cause);
  }

  getUserMessage(): string {
    return 'We could not find what you were looking for.';
  }
}

export class ConflictError extends ApplicationError {
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(message, 'CONFLICT_ERROR', 409, true, context, cause);
  }

  getUserMessage(): string {
    return 'This action conflicts with existing data.';
  }
}

export class ApiError extends ApplicationError {
  constructor(
    message: string,
    public readonly endpoint: string,
    statusCode: number = 500,
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, 'API_ERROR', statusCode, true, { endpoint, ...context }, cause);
  }

  getUserMessage(): string {
    if (this.statusCode >= 400 && this.statusCode < 500) {
      return 'There was an issue with your request. Please try again.';
    }
    return 'The service is temporarily unavailable. Please try again later.';
  }
}
