/**
 * Base Application Error
 *
 * All custom application errors should extend from this base class.
 * Provides consistent error structure and metadata.
 */
export class ApplicationError extends Error {
  public readonly timestamp: Date;
  public readonly stackTrace?: string;
  public readonly code!: string;
  public readonly statusCode!: number;
  public readonly isOperational!: boolean;
  public readonly context?: Record<string, unknown>;
  public readonly cause?: Error;

  constructor(init: {
    message: string;
    code: string;
    statusCode?: number;
    isOperational?: boolean;
    context?: Record<string, unknown>;
    cause?: Error;
  });
  constructor(
    message: string,
    code: string,
    statusCode?: number,
    isOperational?: boolean,
    context?: Record<string, unknown>,
    cause?: Error
  );
  constructor(...args: unknown[]) {
    const { message, code, statusCode, isOperational, context, cause } =
      args.length === 1 && typeof args[0] === 'object' && args[0] !== null
        ? (args[0] as {
            message: string;
            code: string;
            statusCode?: number;
            isOperational?: boolean;
            context?: Record<string, unknown>;
            cause?: Error;
          })
        : (() => {
            const [message, code, statusCode, isOperational, context, cause] = args as [
              string,
              string,
              number?,
              boolean?,
              Record<string, unknown>?,
              Error?,
            ];
            return { message, code, statusCode, isOperational, context, cause };
          })();
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.stackTrace = this.stack;
    this.code = code;
    this.statusCode = statusCode ?? 500;
    this.isOperational = isOperational ?? true;
    this.context = context;
    this.cause = cause;
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      cause: this.cause?.message,
      stack: this.stackTrace,
    };
  }

  getUserMessage(): string {
    return this.message;
  }
}

export default ApplicationError;
