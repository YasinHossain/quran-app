'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Spinner } from '@/app/shared/Spinner';
import { useSettings } from '@/app/providers/SettingsContext';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { applyTajweed } from '@/lib/text/tajweed';
import { cn } from '@/lib/utils/cn';

import type { Verse } from '@/types';

interface MushafMainProps {
  mushafName: string;
  verses: Verse[];
  isLoading: boolean;
  error: string | null;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isValidating: boolean;
  isReachingEnd: boolean;
}

type ReaderSettings = Pick<
  ReturnType<typeof useSettings>['settings'],
  'tajweed' | 'arabicFontFace' | 'arabicFontSize'
>;

interface PageGroup {
  pageNumber: number | null;
  verses: Verse[];
}

const groupVersesByPage = (verses: Verse[]): PageGroup[] => {
  if (!verses.length) return [];
  const buckets = new Map<number | null, Verse[]>();

  verses.forEach((verse) => {
    const key = typeof verse.page_number === 'number' ? verse.page_number : null;
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.push(verse);
    } else {
      buckets.set(key, [verse]);
    }
  });

  return Array.from(buckets.entries())
    .sort(([a], [b]) => {
      if (a === null) return 1;
      if (b === null) return -1;
      return a - b;
    })
    .map(([pageNumber, versesForPage]) => ({
      pageNumber,
      verses: versesForPage,
    }));
};

export function MushafMain({
  mushafName,
  verses,
  isLoading,
  error,
  loadMoreRef,
  isValidating,
  isReachingEnd,
}: MushafMainProps): React.JSX.Element {
  const { t } = useTranslation();
  const { settings } = useSettings();

  const pageGroups = useMemo(() => groupVersesByPage(verses), [verses]);
  const showEmptyState = !isLoading && !error && !verses.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-surface/80 px-4 py-3 text-center shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
          Mushaf mode
        </p>
        <p className="text-base font-medium text-foreground mt-1">{mushafName}</p>
      </div>

      {isLoading && !verses.length ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8 text-accent" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-status-error bg-status-error/10 px-6 py-8 text-center text-status-error">
          {error}
        </div>
      ) : showEmptyState ? (
        <div className="text-center py-16 text-muted">{t('no_verses_found')}</div>
      ) : (
        pageGroups.map((page) => (
          <MushafPage
            key={`${page.pageNumber ?? 'na'}-${page.verses[0]?.id ?? 'empty'}`}
            pageNumber={page.pageNumber}
            mushafName={mushafName}
            verses={page.verses}
            settings={settings}
          />
        ))
      )}

      {verses.length > 0 ? (
        <div ref={loadMoreRef} className="py-4 text-center space-x-2">
          {isValidating && <Spinner className="inline h-5 w-5 text-accent" />}
          {isReachingEnd && <span className="text-muted">{t('end_of_surah')}</span>}
        </div>
      ) : null}
    </div>
  );
}

interface MushafPageProps {
  pageNumber: number | null;
  verses: Verse[];
  mushafName: string;
  settings: ReaderSettings;
}

const MushafPage = ({ pageNumber, verses, mushafName, settings }: MushafPageProps): React.JSX.Element => {
  const rangeLabel = formatVerseRange(verses);
  const label = pageNumber ? `Page ${pageNumber}` : mushafName;

  return (
    <section
      aria-label={label}
      className="rounded-[32px] border border-border bg-surface shadow-card overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-surface/70 px-6 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          {label}
        </p>
        {rangeLabel ? <p className="text-sm text-muted">{rangeLabel}</p> : null}
      </div>
      <div className="px-5 py-6 sm:px-8 sm:py-8 bg-background">
        <div className="space-y-6" dir="rtl">
          {verses.map((verse) => (
            <MushafAyah key={verse.id} verse={verse} settings={settings} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface MushafAyahProps {
  verse: Verse;
  settings: ReaderSettings;
}

const MushafAyah = ({ verse, settings }: MushafAyahProps): React.JSX.Element => {
  const verseNumber = getVerseNumber(verse);
  const html = settings.tajweed ? applyTajweed(verse.text_uthmani) : verse.text_uthmani;

  return (
    <div className="flex flex-row-reverse flex-wrap items-baseline gap-3 text-foreground">
      {verseNumber ? <VerseMarker number={verseNumber} /> : null}
      <p
        className="flex-1 text-right leading-[2.2]"
        dir="rtl"
        style={{
          fontFamily: settings.arabicFontFace,
          fontSize: `${settings.arabicFontSize}px`,
        }}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
      />
    </div>
  );
};

const VerseMarker = ({ number }: { number: number }): React.JSX.Element => (
  <span
    aria-label={`Ayah ${number}`}
    className={cn(
      'inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold',
      'border-border bg-surface text-foreground shadow-sm'
    )}
  >
    {number}
  </span>
);

const getVerseNumber = (verse: Verse): number | undefined => {
  if (typeof verse.verse_number === 'number') {
    return verse.verse_number;
  }
  if (typeof verse.verse_key === 'string') {
    const [, ayah] = verse.verse_key.split(':');
    const parsed = Number(ayah);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const formatVerseRange = (verses: Verse[]): string => {
  if (!verses.length) return '';
  const first = verses[0]?.verse_key;
  const last = verses[verses.length - 1]?.verse_key;
  if (!first) return '';
  if (!last || first === last) return first;
  return `${first} - ${last}`;
};
