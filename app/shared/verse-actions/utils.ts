import { logger } from '@/src/infrastructure/monitoring/Logger';
import { ErrorHandler } from '@/src/infrastructure/errors';

export const defaultShare = () => {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  if (navigator.share) {
    navigator
      .share({ title: 'Quran', url })
      .catch((err) => {
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
