import { getLocaleFromPathname, localizeHref } from '@/app/shared/i18n/localeRouting';
import { buildVerseRoute } from '@/app/shared/navigation/routes';
import { ErrorHandler } from '@/src/infrastructure/errors';
import { logger } from '@/src/infrastructure/monitoring/Logger';

const VERSE_KEY = /^([1-9]\d{0,2}):([1-9]\d{0,2})$/;

/**
 * Shareable URL of a verse: its own page (`/surah/2/255`) in the language of the current page,
 * e.g. `/bn/surah/2/255` when sharing from a Bangla page. `null` for a malformed verse key.
 */
export const buildVerseShareUrl = (
  verseKey: string,
  location: Pick<Location, 'origin' | 'pathname'>
): string | null => {
  const match = VERSE_KEY.exec(verseKey.trim());
  if (!match) return null;
  const locale = getLocaleFromPathname(location.pathname) ?? 'en';
  return `${location.origin}${localizeHref(buildVerseRoute(match[1]!, match[2]!), locale)}`;
};

const reportShareError = (err: unknown): void => {
  logger.warn('Share failed', undefined, err as Error);
  ErrorHandler.handleSync(err, { logError: false, reportError: false });
};

/** Shares (or copies) the verse page URL; without a verse key, the current page URL. */
export const defaultShare = (verseKey?: string): void => {
  if (typeof window === 'undefined') return;
  const url =
    (verseKey ? buildVerseShareUrl(verseKey, window.location) : null) ?? window.location.href;
  if (navigator.share) {
    navigator
      .share({ title: verseKey ? `Quran ${verseKey}` : 'Quran', url })
      .catch(reportShareError);
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url).catch(reportShareError);
  }
};
