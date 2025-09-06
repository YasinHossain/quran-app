import { ApplicationError } from '../ApplicationError';

export class NetworkError extends ApplicationError {
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(message, 'NETWORK_ERROR', 503, true, context, cause);
  }

  getUserMessage(): string {
    return 'Network connection failed. Please check your internet connection and try again.';
  }
}

export class RateLimitError extends ApplicationError {
  constructor(
    message: string = 'Rate limit exceeded',
    public readonly retryAfter?: number,
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, 'RATE_LIMIT_ERROR', 429, true, { retryAfter, ...context }, cause);
  }

  getUserMessage(): string {
    const waitTime = this.retryAfter ? ` Please wait ${this.retryAfter} seconds.` : '';
    return `Too many requests.${waitTime}`;
  }
}
