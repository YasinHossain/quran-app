import { logger } from '../monitoring/Logger';
import { ApplicationError } from './ApplicationError';

/**
 * Error notification interface
 */
export interface ErrorNotification {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

let retryCallback: () => void = () => {};

export function setRetryCallback(callback: () => void): void {
  retryCallback = callback;
}

export function getRetryCallback(): () => void {
  return retryCallback;
}

/**
 * Create user notification from error
 */
export function createNotification(error: ApplicationError): ErrorNotification {
  const baseNotification: ErrorNotification = {
    title: 'Error',
    message: error.getUserMessage(),
    type: 'error',
    duration: 5000,
  };

  switch (error.code) {
    case 'NETWORK_ERROR':
      return {
        ...baseNotification,
        title: 'Connection Error',
        actions: [
          {
            label: 'Retry',
            action: () => getRetryCallback()(),
          },
        ],
      };
    case 'VALIDATION_ERROR':
      return {
        ...baseNotification,
        title: 'Validation Error',
        type: 'warning',
        duration: 3000,
      };
    case 'AUTHENTICATION_ERROR':
      return {
        ...baseNotification,
        title: 'Authentication Required',
        actions: [
          {
            label: 'Sign In',
            action: () => {
              logger.info('Redirect to sign in');
            },
          },
        ],
      };
    case 'NOT_FOUND':
      return {
        ...baseNotification,
        title: 'Not Found',
        type: 'info',
        duration: 3000,
      };
    case 'RATE_LIMIT_ERROR':
      return {
        ...baseNotification,
        title: 'Rate Limit Exceeded',
        type: 'warning',
        duration: 8000,
      };
    case 'AUDIO_ERROR':
      return {
        ...baseNotification,
        title: 'Audio Error',
        actions: [
          {
            label: 'Try Again',
            action: () => {
              logger.info('Retry audio playback');
            },
          },
        ],
      };
    default:
      return baseNotification;
  }
}
