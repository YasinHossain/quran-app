import { ApplicationError } from '@/src/infrastructure/errors/ApplicationError';

export class NotFoundError extends ApplicationError {
  constructor(resource: string, context?: Record<string, unknown>, cause?: Error) {
    const message = `${resource} not found`;
    super(message, 'NOT_FOUND', 404, true, { resource, ...context }, cause);
  }

  override getUserMessage(): string {
    const resource =
      ((this.context as Record<string, unknown> | undefined)?.['resource'] as string | undefined) ||
      'Resource';
    return `${resource} could not be found.`;
  }
}

export class ConflictError extends ApplicationError {
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(message, 'CONFLICT_ERROR', 409, true, context, cause);
  }

  override getUserMessage(): string {
    return 'This action conflicts with existing data.';
  }
}

export class ApiError extends ApplicationError {
  public readonly endpoint: string;

  constructor(init: {
    message: string;
    endpoint: string;
    statusCode?: number;
    context?: Record<string, unknown>;
    cause?: Error;
  });
  constructor(
    message: string,
    endpoint: string,
    statusCode?: number,
    context?: Record<string, unknown>,
    cause?: Error
  );
  constructor(...args: unknown[]) {
    const { message, endpoint, statusCode, context, cause } =
      args.length === 1 && typeof args[0] === 'object' && args[0] !== null
        ? (args[0] as {
            message: string;
            endpoint: string;
            statusCode?: number;
            context?: Record<string, unknown>;
            cause?: Error;
          })
        : (() => {
            const [message, endpoint, statusCode, context, cause] = args as [
              string,
              string,
              number?,
              Record<string, unknown>?,
              Error?,
            ];
            return { message, endpoint, statusCode, context, cause };
          })();
    const init: {
      message: string;
      code: string;
      statusCode?: number;
      isOperational?: boolean;
      context?: Record<string, unknown>;
      cause?: unknown;
    } = {
      message,
      code: 'API_ERROR',
      isOperational: true,
      context: { endpoint, ...context },
    };
    if (statusCode !== undefined) init.statusCode = statusCode;
    if (cause) init.cause = cause;
    super(init);
    this.endpoint = endpoint;
  }

  override getUserMessage(): string {
    if (this.statusCode >= 400 && this.statusCode < 500) {
      return 'There was an issue with your request. Please try again.';
    }
    return 'The service is temporarily unavailable. Please try again later.';
  }
}
