/**
 * Base Application Error
 *
 * All custom application errors should extend from this base class.
 * Provides consistent error structure and metadata.
 */
export class ApplicationError extends Error {
  public readonly timestamp: Date;
  public readonly stackTrace?: string;

  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly isOperational: boolean = true,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: Error
  ) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.stackTrace = this.stack;
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
