import { ErrorHandler } from '@/src/infrastructure/errors';
import { logger } from '@/src/infrastructure/monitoring/Logger';

export const defaultShare = (): void => {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  if (navigator.share) {
    navigator.share({ title: 'Quran', url }).catch((err) => {
      logger.warn('Share failed', undefined, err);
      ErrorHandler.handleSync(err, { logError: false, reportError: false });
    });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url).catch((err) => {
      logger.warn('Share failed', undefined, err);
      ErrorHandler.handleSync(err, { logError: false, reportError: false });
    });
  }
};
