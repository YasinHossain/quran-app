import type { ErrorContext, IErrorTracker } from './types';
import type { ApplicationError } from '@/src/infrastructure/errors';

export type Breadcrumb = Parameters<IErrorTracker['addBreadcrumb']>[0];

let breadcrumbs: Breadcrumb[] = [];
const MAX_BREADCRUMBS = 100;

export function addBreadcrumb(tracker: IErrorTracker, breadcrumb: Breadcrumb): void {
  const enhancedBreadcrumb = {
    timestamp: Date.now() / 1000,
    ...breadcrumb,
  };

  breadcrumbs.push(enhancedBreadcrumb);

  if (breadcrumbs.length > MAX_BREADCRUMBS) {
    breadcrumbs = breadcrumbs.slice(-MAX_BREADCRUMBS);
  }

  tracker.addBreadcrumb(enhancedBreadcrumb);
}

export function getBreadcrumbs(limit = 10): Breadcrumb[] {
  return breadcrumbs.slice(-limit);
}

export function setupGlobalHandlers(
  captureError: (error: Error | ApplicationError, context?: ErrorContext) => void
): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    captureError(event.error || new Error(event.message), {
      component: 'global',
      action: 'unhandled_error',
      metadata: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    captureError(event.reason, {
      component: 'global',
      action: 'unhandled_rejection',
    });
  });
}
