import { ApplicationError } from '../core/ApplicationError';

export class ValidationError extends ApplicationError {
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(message, 'VALIDATION_ERROR', 400, true, context, cause);
  }

  getUserMessage(): string {
    return 'Please check your input and try again.';
  }
}

export default ValidationError;
