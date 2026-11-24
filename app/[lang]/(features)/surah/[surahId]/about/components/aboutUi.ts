import { cn } from '@/lib/utils/cn';

/** Shared styling bits of the surah overview page's sections. */

export const QURAN_FONT = "'UthmanicHafs1Ver18', serif";
/** Arabic quoted inside tafsir text (not Uthmani Quran text, so a general Naskh face). */
export const ARABIC_QUOTE_FONT = "'Noto Naskh Arabic', 'UthmanicHafs1Ver18', serif";

export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/** Small caps-style label; letter spacing only for Latin script (it breaks Arabic joining). */
export const labelClass = (locale: string): string =>
  cn('text-xs font-semibold text-muted', locale === 'en' && 'uppercase tracking-[0.14em]');

/** Outer shell shared by every section card, so they all read as one family. */
export const sectionCardClass = 'rounded-2xl border border-border bg-surface';
export const cardClass = `${sectionCardClass} p-5 sm:p-6`;
