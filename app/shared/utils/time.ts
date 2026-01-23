type RelativeUnit = Intl.RelativeTimeFormatUnit;

const TIME_UNITS: Array<{ unit: RelativeUnit; seconds: number }> = [
  { unit: 'year', seconds: 365 * 24 * 60 * 60 },
  { unit: 'month', seconds: 30 * 24 * 60 * 60 },
  { unit: 'week', seconds: 7 * 24 * 60 * 60 },
  { unit: 'day', seconds: 24 * 60 * 60 },
  { unit: 'hour', seconds: 60 * 60 },
  { unit: 'minute', seconds: 60 },
  { unit: 'second', seconds: 1 },
];

const hasRelativeTimeFormat = (): boolean =>
  typeof Intl !== 'undefined' && typeof Intl.RelativeTimeFormat === 'function';

/**
 * Returns a locale-aware "time ago" string (e.g. "3 days ago", "এখন", etc.)
 */
export const formatTimeAgo = (timestamp: number, locale = 'en'): string => {
  const diffSeconds = Math.floor((Date.now() - timestamp) / 1000);

  if (!Number.isFinite(diffSeconds) || diffSeconds <= 0) {
    if (hasRelativeTimeFormat()) {
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(0, 'second');
    }
    return 'Just now';
  }

  if (hasRelativeTimeFormat()) {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    for (const { unit, seconds } of TIME_UNITS) {
      const value = Math.floor(diffSeconds / seconds);
      if (value > 0) return rtf.format(-value, unit);
    }
    return rtf.format(0, 'second');
  }

  // Fallback (English-only)
  for (const { unit, seconds } of TIME_UNITS) {
    if (unit === 'second') continue;
    const value = Math.floor(diffSeconds / seconds);
    if (value > 0) return `${value} ${unit}${value === 1 ? '' : 's'} ago`;
  }
  return 'Just now';
};
