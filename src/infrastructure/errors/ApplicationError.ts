/**
 * Base Application Error
 *
 * All custom application errors should extend from this base class.
 * Provides consistent error structure and metadata.
 */
export class ApplicationError extends Error {
  public readonly timestamp: Date;
  public readonly stackTrace: string | undefined;
  public readonly code!: string;
  public readonly statusCode!: number;
  public readonly isOperational!: boolean;
  public readonly context: Record<string, unknown> | undefined;
  public override readonly cause: unknown | undefined;

  constructor(init: {
    message: string;
    code: string;
    statusCode?: number;
    isOperational?: boolean;
    context?: Record<string, unknown>;
    cause?: unknown;
  });
  constructor(
    message: string,
    code: string,
    statusCode?: number,
    isOperational?: boolean,
    context?: Record<string, unknown>,
    cause?: unknown
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
            cause?: unknown;
          })
        : (() => {
            const [message, code, statusCode, isOperational, context, cause] = args as [
              string,
              string,
              number?,
              boolean?,
              Record<string, unknown>?,
              unknown?,
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
    const payload: Record<string, unknown> = {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      timestamp: this.timestamp.toISOString(),
    };
    if (this.context) payload['context'] = this.context;
    if (this.stackTrace) payload['stack'] = this.stackTrace;
    if (this.cause instanceof Error) payload['cause'] = this.cause.message;
    return payload;
  }

  getUserMessage(): string {
    return this.message;
  }
}

export default ApplicationError;
