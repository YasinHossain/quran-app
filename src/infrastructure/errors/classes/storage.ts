import { ApplicationError } from '../core/ApplicationError';

export class StorageError extends ApplicationError {
  constructor(
    message: string,
    public readonly storageType: 'localStorage' | 'indexedDB' | 'memory',
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, 'STORAGE_ERROR', 500, true, { storageType, ...context }, cause);
  }

  getUserMessage(): string {
    return 'Failed to save data locally. Please try again.';
  }
}

export class CacheError extends ApplicationError {
  constructor(
    message: string,
    public readonly operation: 'get' | 'set' | 'delete' | 'clear',
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, 'CACHE_ERROR', 500, true, { operation, ...context }, cause);
  }

  getUserMessage(): string {
    return 'Cache operation failed. This may affect performance but functionality should continue.';
  }
}
