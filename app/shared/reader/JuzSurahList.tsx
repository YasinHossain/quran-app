import Link from 'next/link';
import React from 'react';

import { localizeHref } from '@/app/shared/i18n/localeRouting';
import { buildSurahRoute } from '@/app/shared/navigation/routes';
import { getJuzSurahRanges } from '@/lib/seo/juzSurahs';
import { localizeDigits } from '@/lib/text/localizeNumbers';

import type { ServerTranslator } from '@/app/shared/i18n/serverLocale';
import type { UiLanguageCode } from '@/app/shared/i18n/uiLanguages';
import type { JuzSummary } from '@/app/shared/navigation/types';

interface JuzSurahListProps {
  juz: JuzSummary;
  translator: ServerTranslator;
  locale: UiLanguageCode;
  dir?: 'ltr' | 'rtl' | undefined;
}

/**
 * Server component: the surahs a juz contains, each linking to its canonical surah page with the
 * verse range it has in the juz ("An-Naba 78:1–40"). Derived from the juz boundaries, never
 * hand-written.
 */
export function JuzSurahList({
  juz,
  translator,
  locale,
  dir,
}: JuzSurahListProps): React.JSX.Element | null {
  const ranges = getJuzSurahRanges(juz);
  if (!ranges.length) return null;

  return (
    <section
      data-slot="juz-surah-list"
      lang={locale}
      {...(dir ? { dir } : {})}
      aria-labelledby="juz-surah-list-heading"
    >
      <h2 id="juz-surah-list-heading" className="mb-3 text-sm font-medium text-foreground">
        {translator.t('juz_surahs_heading', { number: juz.number })}
      </h2>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {ranges.map((range) => (
          <li key={range.surahId}>
            <Link
              href={localizeHref(buildSurahRoute(range.surahId), locale)}
              prefetch={false}
              className="flex min-h-touch items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="truncate font-medium">{translator.surahName(range.surahId)}</span>
              <span className="shrink-0 text-xs text-muted" dir="ltr">
                {localizeDigits(`${range.surahId}:${range.startAyah}–${range.endAyah}`, locale)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
