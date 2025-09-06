import { ApplicationError } from '../core/ApplicationError';

export class AudioError extends ApplicationError {
  constructor(
    message: string,
    public readonly audioUrl?: string,
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, 'AUDIO_ERROR', 500, true, { audioUrl, ...context }, cause);
  }

  getUserMessage(): string {
    return 'Audio playback failed. Please check your connection and try again.';
  }
}

export class ConfigurationError extends ApplicationError {
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(message, 'CONFIGURATION_ERROR', 500, false, context, cause);
  }

  getUserMessage(): string {
    return 'Application configuration error. Please contact support.';
  }
}

export class FeatureNotAvailableError extends ApplicationError {
  constructor(featureName: string, context?: Record<string, unknown>, cause?: Error) {
    const message = `Feature '${featureName}' is not available`;
    super(message, 'FEATURE_NOT_AVAILABLE', 503, true, { featureName, ...context }, cause);
  }

  getUserMessage(): string {
    return 'This feature is currently unavailable.';
  }
}

export class TimeoutError extends ApplicationError {
  constructor(
    message: string,
    public readonly timeoutMs: number,
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, 'TIMEOUT_ERROR', 408, true, { timeoutMs, ...context }, cause);
  }

  getUserMessage(): string {
    return 'Operation timed out. Please try again.';
  }
}
